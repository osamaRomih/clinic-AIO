import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService, IAppointmentRead } from 'DAL';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-all-appointments',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    NgClass
],
  templateUrl: './all-appointments.component.html',
  styleUrl: './all-appointments.component.scss'
})
export class AllAppointmentsComponent implements OnInit {
  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly DEFAULT_PAGE_NUMBER = 1;

  constructor(
    private router: Router,
    private service: AppointmentService,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'id',
    'patientName',
    'phoneNumber',
    'time',
    'status',
    'created',
    'actions',
  ];
  dataSource = new MatTableDataSource<IAppointmentRead>();
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
        this.dataSource.data = res.items.map((item)=>{
          return {
            ...item,
            date:`${moment(item.date).format('DD MMM YYYY')}, ${moment(item.startTime,"HH:mm:ss").format('h:mm A')} - ${moment(item.endTime,"HH:mm:ss").format('h:mm A')}`,
            createdOn:moment(item.date).format('DD MMM YYYY, h:mm A')
          }
        });
        this.totalItems = res.totalCount;
        this.pageSize = pageSize;
        this.pageIndex = res.pageNumber - 1;
      },
    });
  }

  addAppointment() {
    // this.router.navigateByUrl('Appointments/add-Appointment');
  }

  onPageChange(event: PageEvent) {
    this.getAllAppointment(event.pageIndex + 1, event.pageSize);
  }

  updateAppointment(id: number) {
    // this.router.navigate(['/Appointments/update', id]);
  }

  deleteAppointment(id: number) {
    // this.service.delete(id).subscribe({
    //   next: (res) => {
    //     this.getAllAppointment();
    //   },
    // });
  }
  openDialogDetails(id: number) {
    // this.service.getById(id).subscribe({
    //   next: (res) => {
    //     const dialogRef = this.dialog.open(DetailsAppointmentComponent, {
    //       data: res,
    //       width:'750px'
    //     });

    //     dialogRef.afterClosed().subscribe((result) => {});
    //   },
    // });
  }
}
