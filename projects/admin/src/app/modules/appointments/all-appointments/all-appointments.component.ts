import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService, IAppointmentRead } from 'DAL';
import { DatePipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
 import * as XLSX from 'xlsx';


export interface Appointment {
  patient: {
    name: string;
    avatarUrl: string;
  };
  appointmentDate: string;
  time: string;
  email: string;
  mobile: string;
  gender: 'male' | 'female';
  status: 'Upcoming' | 'Completed' | 'Canceled';
  address: string;
  disease: string;
  lastVisitDate: string;
}

// Mock data based on your image
// const APPOINTMENT_DATA: Appointment[] = [
//   { patient: { name: 'John Deo', avatarUrl: 'https://i.pravatar.cc/40?img=1' }, appointmentDate: '2024-02-25', time: '09:00', email: 'john@example.com', mobile: '1234567890', gender: 'female', status: 'Upcoming', address: '123 Elm St, ...', disease: 'Fever', lastVisitDate: '2024-09-01' },
//   { patient: { name: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/40?img=2' }, appointmentDate: '2024-10-02', time: '09:00', email: 'jane@example.com', mobile: '0987654321', gender: 'male', status: 'Completed', address: '456 Oak St, ...', disease: 'Flu', lastVisitDate: '2024-08-15' },
//   { patient: { name: 'Mike Johnson', avatarUrl: 'https://i.pravatar.cc/40?img=3' }, appointmentDate: '2024-10-03', time: '09:00', email: 'mike@example.com', mobile: '5678901234', gender: 'male', status: 'Canceled', address: '789 Pine St, ...', disease: 'Cough', lastVisitDate: '2024-09-05' },
//   { patient: { name: 'Emily Davis', avatarUrl: 'https://i.pravatar.cc/40?img=4' }, appointmentDate: '2024-10-04', time: '09:00', email: 'emily@example.com', mobile: '3216549870', gender: 'male', status: 'Upcoming', address: '321 Maple ...', disease: 'Headache', lastVisitDate: '2024-09-10' },
//   { patient: { name: 'Chris Lee', avatarUrl: 'https://i.pravatar.cc/40?img=5' }, appointmentDate: '2024-10-05', time: '09:00', email: 'chris@example.com', mobile: '4561237890', gender: 'female', status: 'Completed', address: '654 Birch St, ...', disease: 'Stomachache', lastVisitDate: '2024-08-20' },
//   { patient: { name: 'Anna Brown', avatarUrl: 'https://i.pravatar.cc/40?img=6' }, appointmentDate: '2024-10-06', time: '09:00', email: 'anna@example.com', mobile: '6549873210', gender: 'male', status: 'Upcoming', address: '987 Cedar St, ...', disease: 'Allergy', lastVisitDate: '2024-09-15' },
//   { patient: { name: 'David Wilson', avatarUrl: 'https://i.pravatar.cc/40?img=7' }, appointmentDate: '2024-10-07', time: '09:00', email: 'david@example.com', mobile: '7891234560', gender: 'female', status: 'Canceled', address: '159 Walnut ...', disease: 'Back Pain', lastVisitDate: '2024-09-25' },
//   { patient: { name: 'Laura White', avatarUrl: 'https://i.pravatar.cc/40?img=8' }, appointmentDate: '2024-10-08', time: '09:00', email: 'laura@example.com', mobile: '8523697410', gender: 'female', status: 'Upcoming', address: '753 Ash St, ...', disease: 'Anxiety', lastVisitDate: '2024-09-20' },
//   { patient: { name: 'James Moore', avatarUrl: 'https://i.pravatar.cc/40?img=9' }, appointmentDate: '2024-10-09', time: '09:00', email: 'james@example.com', mobile: '9632581470', gender: 'male', status: 'Completed', address: '852 Elm St, ...', disease: 'Sinus Infection', lastVisitDate: '2024-08-30' },
//   { patient: { name: 'Sophia Taylor', avatarUrl: 'https://i.pravatar.cc/40?img=10' }, appointmentDate: '2024-10-10', time: '09:00', email: 'sophia@example.com', mobile: '7418529630', gender: 'male', status: 'Upcoming', address: '369 Maple ...', disease: 'Migraine', lastVisitDate: '2024-09-05' },
// ];
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
    MatTooltip
],
  templateUrl: './all-appointments.component.html',
  styleUrl: './all-appointments.component.scss'
})

export class AllAppointmentsComponent {
  displayedColumns: string[] = [
    'patientName',
    'appointmentDate',
    'time',
    'email',
    'mobile',
    'gender',
    'status',
    'address',
    'visitType',
    'actions'
  ];
  dataSource = new MatTableDataSource<IAppointmentRead>();

  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly DEFAULT_PAGE_NUMBER = 1;

  constructor(
    private router: Router,
    private service: AppointmentService,
    private dialog: MatDialog
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
        console.log(res)
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

  exportAsExcel(){
    const dataToExport = this.dataSource.data.map(item => {
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

    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Appointments');

      XLSX.writeFile(wb, 'Appointments.xlsx');
  }

  onPageChange(event: PageEvent) {
    this.getAllAppointment(event.pageIndex + 1, event.pageSize);
  }
}
