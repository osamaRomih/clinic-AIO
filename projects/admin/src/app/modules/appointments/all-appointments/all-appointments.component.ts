import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService, IAppointmentRead, MaterialTableComponent, SnackbarService, TableColumn } from 'DAL';
import * as XLSX from 'xlsx';
import { AppointmentDetailsComponent } from '../appointment-details/appointment-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-all-appointments',
  standalone: true,
  imports: [MatIconModule, MaterialTableComponent],
  templateUrl: './all-appointments.component.html',
  styleUrl: './all-appointments.component.scss',
})
export class AllAppointmentsComponent {
  router = inject(Router);
  service = inject(AppointmentService);
  snackBarService = inject(SnackbarService);
  dialog = inject(MatDialog);

  appointmentsTableColumns!: TableColumn[];
  totalItems!: number;
  pageSize: number = 10;
  pageIndex!: number;
  appointments!: IAppointmentRead[];

  ngOnInit(): void {
    this.getAllAppointment();
    this.initColumns();
  }

  getAllAppointment(pageNumber: number = 1, pageSize: number = 10) {
    this.service.getAll(pageNumber, pageSize).subscribe({
      next: (res) => {
        this.appointments = res.items;
        this.totalItems = res.totalCount;
        this.pageSize = pageSize;
        this.pageIndex = res.pageNumber - 1;
      },
    });
  }

  exportAsExcel() {
    const dataToExport = this.appointments.map((item) => {
      return {
        'Patient Name': item.patientName,
        'Appointment Date': item.date,
        Time: item.startTime,
        Email: item.email,
        Mobile: item.phoneNumber,
        Gender: item.gender,
        Status: item.status,
        Address: item.address,
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

  confirmBulkDelete(selectedRows: any[]) {
    const count = selectedRows.length;
    if (!count) return;
    if (confirm(`Delete ${count} selected appointment(s)?`)) {
      this.deleteSelected(selectedRows);
    }
  }

  private deleteSelected(selectedRows: any[]) {
    const ids = selectedRows.map((x) => x.id);

    if (!ids.length) return;

    this.service.deleteMany(ids).subscribe({
      next: () => {
        const deleted = new Set(ids);
        this.appointments = this.appointments.filter((r) => !deleted.has(r.id));
        this.totalItems = Math.max(0, (this.totalItems ?? 0) - ids.length);

        // If page becomes empty after deletion, reload current page
        if (this.appointments.length === 0) {
          this.getAllAppointment(this.pageIndex + 1, this.pageSize);
        }

        this.snackBarService.success('Deleted successfully');
      },
      error: () => this.snackBarService.error('Delete failed'),
    });
  }

  onAdd() {
    this.router.navigate(['appointments/add']);
  }

  onEdit(id: number) {
    this.router.navigate(['appointments/edit', id]);
  }

  onDelete(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.getAllAppointment();
        this.snackBarService.success('Deleted successfully');
      },
      error: () => this.snackBarService.error('Delete failed'),
    });
  }

  openDialogDetails(id: number) {
      this.service.getById(id).subscribe({
        next: (res) => {
          const dialogRef = this.dialog.open(AppointmentDetailsComponent, {
            data: res,
            width: '750px',
          });
  
          dialogRef.afterClosed().subscribe((result) => {});
        },
      });
    }

  initColumns(): void {
    this.appointmentsTableColumns = [
      {
        name: 'Patient Name',
        dataKey: 'patientName',
        isSortable: true,
      },
      {
        name: 'AppointmentDate',
        dataKey: 'date',
        isSortable: true,
      },
      {
        name: 'Time',
        dataKey: 'startTime',
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
        name: 'Status',
        dataKey: 'status',
        isSortable: true,
      },
      {
        name: 'Address',
        dataKey: 'address',
        isSortable: true,
      },
      {
        name: 'Visit Type',
        dataKey: 'visitType',
        isSortable: true,
      },
    ];
  }
}
