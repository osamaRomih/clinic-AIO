import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DialogService, IPatientRead, MaterialTableComponent, PatientService, SnackbarService, TableColumn } from 'DAL';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-all-patients',
  standalone: true,
  imports: [MatIconModule,MaterialTableComponent],
  templateUrl: './all-patients.component.html',
  styleUrl: './all-patients.component.scss',
})
export class AllPatientsComponent {
  private router = inject(Router);
  private patientService = inject(PatientService);
  private snackBarService = inject(SnackbarService);
  private confirmationDialog = inject(DialogService);

  patientsTableColumns!: TableColumn[];
  totalItems!: number;
  pageSize: number = 10;
  pageNumber: number = 1;
  patients!: IPatientRead[];
  searchBy?: string;
  sortBy?: string;
  sortDirection?: string;

  ngOnInit(): void {
    this.getAllPatients();
    this.initColumns();
  }

  getAllPatients() {
    this.patientService.getAll(this.pageNumber, this.pageSize, this.searchBy, this.sortBy, this.sortDirection).subscribe({
      next: (res) => {
        this.patients = res.items;
        this.totalItems = res.totalCount;
        this.pageNumber = res.pageNumber;
      },
    });
  }

  onSearch(value:string){
    this.pageNumber = 1;
    this.searchBy = value;
    this.getAllPatients();
  }

  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.patients);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Patients');

    XLSX.writeFile(wb, 'Patients.xlsx');
  }

  onPageChange(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAllPatients();
  }

  onSort(event:Sort){
    this.sortBy = event.active;
    this.sortDirection = event.direction;
    this.pageNumber = 1;

    this.getAllPatients();
  }

  confirmBulkDelete(selectedRows: any[]) {
    const count = selectedRows.length;
    if (!count) return;
    this.confirmationDialog.confirmDialog('Delete Confirmation', `Are you sure you want to delete ${count} selected patient(s)?`).subscribe((result)=>{
      if(result)
        this.deleteSelected(selectedRows);
    });
  }

  private deleteSelected(selectedRows: any[]) {
    const ids = selectedRows.map((x) => x.id);

    if (!ids.length) return;

    this.patientService.deleteMany(ids).subscribe({
      next: () => {
        const deleted = new Set(ids);
        this.patients = this.patients.filter((r) => !deleted.has(r.id));
        this.totalItems = Math.max(0, (this.totalItems ?? 0) - ids.length);

        // If page becomes empty after deletion, reload current page
        if (this.patients.length === 0) {
          this.pageNumber++;
          this.getAllPatients();
        }

        this.snackBarService.success('Deleted successfully');
      },
      error: () => this.snackBarService.error('Delete failed'),
    });
  }

  onAdd() {
    this.router.navigate(['patients/add']);
  }

  onEdit(id: string) {
    this.router.navigate(['patients/edit', id]);
  }

  onDelete(id: string) {
    this.patientService.delete(id).subscribe({
      next: () => {
        this.getAllPatients();
        this.snackBarService.success('Deleted successfully');
      },
      error: () => this.snackBarService.error('Delete failed'),
    });
  }

  openDialogDetails(id: number) {
    // this.service.getById(id).subscribe({
    //   next: (res) => {
    //     const dialogRef = this.dialog.open(AppointmentDetailsComponent, {
    //       data: res,
    //       width: '750px',
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {});
    //   },
    // });
  }

  initColumns(): void {
    this.patientsTableColumns = [
      {
        name: 'Name',
        dataKey: 'firstName',
        isSortable: true,
      },
      {
        name: 'User name',
        dataKey: 'userName',
        isSortable: true,
      },
      {
        name: 'Email',
        dataKey: 'email',
        isSortable: true,
      },
      {
        name: 'Mobile',
        dataKey: 'phoneNumber',
        isSortable: true,
      },
      {
        name: 'Gender',
        dataKey: 'gender',
        isSortable: true,
      },
      {
        name: 'Last Visit',
        dataKey: 'lastVisit',
        isSortable: false,
      },
      {
        name: 'Address',
        dataKey: 'address',
        isSortable: true,
      },
      {
        name: 'Date Of Birth',
        dataKey: 'dateOfBirth',
        isSortable: true,
      },
    ];
  }
}
