import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { IPrescriptionResponse, PrescriptionService } from 'DAL';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";



@Component({
  selector: 'app-all-prescription',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatPaginatorModule, MatIconModule],
  templateUrl: './all-prescription.component.html',
  styleUrl: './all-prescription.component.scss'
})
export class AllPrescriptionComponent implements OnInit {
  private readonly DEFAULT_PAGE_SIZE = 5;
  private readonly DEFAULT_PAGE_NUMBER = 1;

  constructor(private router:Router,private service:PrescriptionService){}
  
  displayedColumns: string[] = ['id', 'patientName', 'diagnosis', 'date', 'nextVisit', 'age','actions'];
  dataSource=new MatTableDataSource<IPrescriptionResponse>();
  totalItems!:number;
  pageSize:number = this.DEFAULT_PAGE_SIZE;
  pageIndex!:number;

  ngOnInit(): void {
    this.getAllPrescription();
  }


  getAllPrescription(pageNumber:number = this.DEFAULT_PAGE_NUMBER,pageSize:number = this.DEFAULT_PAGE_SIZE){
    this.service.getAll(pageNumber,pageSize).subscribe({
      next:(res)=>{
        this.dataSource.data = res.items;
        this.totalItems = res.totalCount;
        this.pageSize = pageSize;
        this.pageIndex = res.pageNumber - 1;

      }
    })
  }
  
  addPrescription(){
    this.router.navigateByUrl('prescriptions/add-prescription');
  }

  onPageChange(event:PageEvent){
    this.getAllPrescription(event.pageIndex + 1 , event.pageSize)

  }

  updatePrescription(id:number){
    this.router.navigate(['/prescriptions/update',id])
  }

  deletePrescription(id:number){
    this.service.delete(id).subscribe({
      next:(res)=>{
        this.getAllPrescription();
      }
    })
  }
}
