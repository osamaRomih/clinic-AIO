import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IPrescription, IPrescriptionResponse, MaterialTableComponent, PrescriptionService, TableColumn } from 'DAL';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DetailsPrescriptionComponent } from '../details-prescription/details-prescription.component';
import { Sort } from '@angular/material/sort';
import * as XLSX from 'xlsx';

interface Customer {
  id: number;
  name: string;
  age: number;
}
@Component({
  selector: 'app-all-prescription',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MaterialTableComponent,
  ],
  templateUrl: './all-prescription.component.html',
  styleUrl: './all-prescription.component.scss',
})
export class AllPrescriptionComponent implements OnInit {

  router = inject(Router);
  service = inject(PrescriptionService);
  dialog = inject(MatDialog);
  
  prescriptionsTableColumns!: TableColumn[];
  totalItems!: number;
  pageSize: number = 10;
  pageIndex!: number;
  prescriptions!: IPrescription[];

  ngOnInit(): void {
    this.getAllPrescription();
    this.initColumns();
  }

  getAllPrescription(pageNumber: number = 1,pageSize: number = 10) {
    this.service.getAll(pageNumber, pageSize).subscribe({
      next: (res) => {
        this.prescriptions = res.items.map((item) => {
          return {
            ...item,
            date: moment(item.date).format('LL'),
            nextVisit: moment(item.date).format('LL'),
          } as IPrescription;
        });
        this.totalItems = res.totalCount;
        this.pageSize = pageSize;
        this.pageIndex = res.pageNumber - 1;
      },
    });
  }

  onAdd() {
    this.router.navigateByUrl('prescriptions/add-prescription');
  }

  onPageChange(event: PageEvent) {
    this.getAllPrescription(event.pageIndex + 1, event.pageSize);
  }

  onEdit(id: number) {
    this.router.navigate(['/prescriptions/update', id]);
  }

  onDelete(id: number) {
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

  initColumns(): void {
    this.prescriptionsTableColumns = [
      {
        name: 'Id',
        dataKey: 'id',
        isSortable: true,
      },
      {
        name: 'Patient Name',
        dataKey: 'patientName',
        isSortable: true,
      },
      {
        name: 'Age',
        dataKey: 'age',
        isSortable: true,
      },
      {
        name: 'Diagnosis',
        dataKey: 'diagnosis',
        isSortable: true,
      },
      {
        name: 'Next Visit',
        dataKey: 'nextVisit',
        isSortable: true,
      },
      
    ];
  }

  sortData(sortParameters: Sort) {
    const key = sortParameters.active as keyof IPrescription;

    if (!key) return;

    const dir =
      sortParameters.direction === 'asc'
        ? 1
        : sortParameters.direction === 'desc'
        ? -1
        : 0;
    if (dir === 0) {
       this.getAllPrescription();
      return;
    }

    this.prescriptions = [...this.prescriptions].sort((a, b) => {
      const va = toComparableValue(a[key]);
      const vb = toComparableValue(b[key]);

      // number compare
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * dir;
      }

      // string compare
      return String(va).localeCompare(String(vb)) * dir;
    });
  }

  exportAsExcel(){
    const dataToExport = this.prescriptions.map((item) => {
      return {
        'Patient Name': item.patientName,
        'Appointment Date': item.date,
        'Age': item.age,
        'Diagnosis': item.diagnosis,
        'Next Visit': item.nextVisit,
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Prescriptions');

    XLSX.writeFile(wb, 'Prescriptions.xlsx');
  }

  removeOrder(order: Customer) {
    this.prescriptions = this.prescriptions.filter((item) => item.id !== order.id);
  }
}

function toComparableValue(val: unknown): string | number {
  if (val == null) return ''; // null/undefined => empty string
  if (typeof val === 'number') return val;
  if (val instanceof Date) return val.getTime();
  return String(val).toLowerCase(); // strings (case-insensitive)
}
