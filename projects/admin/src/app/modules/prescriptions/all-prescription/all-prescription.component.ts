import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IPrescriptionResponse, PrescriptionService } from 'DAL';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DetailsPrescriptionComponent } from '../details-prescription/details-prescription.component';

@Component({
  selector: 'app-all-prescription',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './all-prescription.component.html',
  styleUrl: './all-prescription.component.scss',
})
export class AllPrescriptionComponent implements OnInit {
  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly DEFAULT_PAGE_NUMBER = 1;

  constructor(
    private router: Router,
    private service: PrescriptionService,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'id',
    'patientName',
    'diagnosis',
    'date',
    'nextVisit',
    'age',
    'actions',
  ];
  dataSource = new MatTableDataSource<IPrescriptionResponse>();
  totalItems!: number;
  pageSize: number = this.DEFAULT_PAGE_SIZE;
  pageIndex!: number;

  ngOnInit(): void {
    this.getAllPrescription();
  }

  getAllPrescription(
    pageNumber: number = this.DEFAULT_PAGE_NUMBER,
    pageSize: number = this.DEFAULT_PAGE_SIZE
  ) {
    this.service.getAll(pageNumber, pageSize).subscribe({
      next: (res) => {
        this.dataSource.data = res.items.map((item) => {
          return {
            ...item,
            date: moment(item.date).format('LL'),
            nextVisit: moment(item.date).format('LL'),
          };
        });
        this.totalItems = res.totalCount;
        this.pageSize = pageSize;
        this.pageIndex = res.pageNumber - 1;
      },
    });
  }

  addPrescription() {
    this.router.navigateByUrl('prescriptions/add-prescription');
  }

  onPageChange(event: PageEvent) {
    this.getAllPrescription(event.pageIndex + 1, event.pageSize);
  }

  updatePrescription(id: number) {
    this.router.navigate(['/prescriptions/update', id]);
  }

  deletePrescription(id: number) {
    this.service.delete(id).subscribe({
      next: (res) => {
        this.getAllPrescription();
      },
    });
  }
  openDialogDetails(id: number) {
    this.service.getById(id).subscribe({
      next: (res) => {
        const dialogRef = this.dialog.open(DetailsPrescriptionComponent, {
          data: res,
          width: '750px',
        });

        dialogRef.afterClosed().subscribe((result) => {});
      },
    });
  }
}
