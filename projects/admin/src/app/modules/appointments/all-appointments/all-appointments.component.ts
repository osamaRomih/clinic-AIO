import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService, IAppointmentRead, SnackbarService } from 'DAL';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

import * as XLSX from 'xlsx';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-all-appointments',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    NgClass,
    MatMenuModule,
    DatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltip,
    MatCheckboxModule,
    CommonModule
  ],
  templateUrl: './all-appointments.component.html',
  styleUrl: './all-appointments.component.scss',
})
export class AllAppointmentsComponent {
  displayedColumns: string[] = [
    'select',
    'patientName',
    'appointmentDate',
    'time',
    'email',
    'mobile',
    'gender',
    'status',
    'address',
    'visitType',
    'actions',
  ];
  dataSource = new MatTableDataSource<IAppointmentRead>();
  selection = new SelectionModel<IAppointmentRead>(true, []);

  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly DEFAULT_PAGE_NUMBER = 1;

  constructor(
    private router: Router,
    private service: AppointmentService,
    private dialog: MatDialog,
    private snackBarService:SnackbarService
  ) {}

  totalItems!: number;
  pageSize: number = this.DEFAULT_PAGE_SIZE;
  pageIndex!: number;

  ngOnInit(): void {
    this.getAllAppointment();
  }

  getAllAppointment(
    pageNumber: number = this.DEFAULT_PAGE_NUMBER,
    pageSize: number = this.DEFAULT_PAGE_SIZE
  ) {
    this.service.getAll(pageNumber, pageSize).subscribe({
      next: (res) => {
        this.dataSource.data = res.items;
        console.log(res);
        this.totalItems = res.totalCount;
        this.pageSize = pageSize;
        this.pageIndex = res.pageNumber - 1;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportAsExcel() {
    const dataToExport = this.dataSource.data.map((item) => {
      return {
        'Patient Name': item.patientName,
        'Appointment Date': item.date,
        'Time': item.startTime,
        'Email': item.email,
        'Mobile': item.phoneNumber,
        'Gender': item.gender,
        'Status': item.status,
        'Address': item.address,
        'Reason For Visit': item.reasonForVisit,
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Appointments');

    XLSX.writeFile(wb, 'Appointments.xlsx');
  }

  onPageChange(event: PageEvent) {
    this.getAllAppointment(event.pageIndex + 1, event.pageSize);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  confirmBulkDelete() {
    const count = this.selection.selected.length;
    if (!count) return;
    if (confirm(`Delete ${count} selected appointment(s)?`)) {
      this.deleteSelected();
    }
  }

  private deleteSelected() {
    const ids = this.selection.selected
      .map((x) => (x as any).id)
      .filter((id): id is number => typeof id === 'number');

    if (!ids.length) return;

    this.service
      .deleteMany(ids)
      .pipe(finalize(() => this.selection.clear()))
      .subscribe({
        next: () => {
          const deleted = new Set(ids);
          this.dataSource.data = this.dataSource.data.filter(
            (r) => !deleted.has((r as any).id)
          );
          this.totalItems = Math.max(0, (this.totalItems ?? 0) - ids.length);

          // If page becomes empty after deletion, reload current page
          if (this.dataSource.data.length === 0) {
            this.getAllAppointment(this.pageIndex + 1, this.pageSize);
          }

          this.snackBarService.success('Deleted successfully');
        },
        error: () =>
          this.snackBarService.error('Delete failed'),
      });
  }


  delete(id:number){
    this.service.delete(id).subscribe({
      next:()=> {
        this.getAllAppointment();
        this.snackBarService.success('Deleted successfully')
      },
      error:()=> this.snackBarService.error('Delete failed')
    })
  }
}
