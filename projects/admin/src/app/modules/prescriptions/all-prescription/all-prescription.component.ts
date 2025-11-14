import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IPrescription, IPrescriptionResponse, PrescriptionService } from 'DAL';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DetailsPrescriptionComponent } from '../details-prescription/details-prescription.component';
import { MaterialTableComponent } from '../../../../../../ui/src/lib/material-table/material-table.component';
import { TableColumn } from '../../../../../../ui/src/lib/interfaces/TableColumn';
import { Sort } from '@angular/material/sort';

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

  prescriptions!: IPrescription[];

  ngOnInit(): void {
    this.getAllPrescription();

    this.initColumns();
  }

  getAllPrescription(
    pageNumber: number = this.DEFAULT_PAGE_NUMBER,
    pageSize: number = this.DEFAULT_PAGE_SIZE
  ) {
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

  addPrescription() {
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

  prescriptionsTableColumns!: TableColumn[];


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
