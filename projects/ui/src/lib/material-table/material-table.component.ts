import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn } from '../interfaces/TableColumn';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DataPropertyGetterPipe } from "../data-property-getter-pipe/data-property-getter.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-material-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    DataPropertyGetterPipe
],
  templateUrl: './material-table.component.html',
  styleUrl: './material-table.component.css'
})
export class MaterialTableComponent implements OnInit,AfterViewInit {
  public tableDataSource = new MatTableDataSource<any>([]);
  public displayedColumns!:string[];

  @ViewChild(MatPaginator, {static: false}) matPaginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) matSort!: MatSort;

  @Input() title = '';
  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() tableColumns:TableColumn[] = [];
  @Input() paginationSizes:number[] = [5,10,15];
  @Input() defaultPageSize = this.paginationSizes[1];
  @Input() totalItems = 0;
  @Input() showEditDelete = true;

  @Output() page = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() sort:EventEmitter<Sort> = new EventEmitter();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() openDialogDetails = new EventEmitter<any>();

  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }

  constructor(){

  }

  ngOnInit(): void {
    this.tableDataSource.data = this.tableData ?? [];
  }

   getDisplayedColumns(): string[] {
    if (this.displayedColumns && this.displayedColumns.length) 
      return this.displayedColumns;

    const cols = this.tableColumns.map(c => c.name);

    if (this.showEditDelete)
      cols.push('actions');

    return cols;
  }

  // we need this, in order to make pagination work with *ngIf
  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;
  }

  setTableDataSource(data:any){
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.paginator = this.matPaginator;
    this.tableDataSource.sort = this.matSort;
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  sortTable(sortParameters:Sort){
    // defining name of data property, to sort by, instead of column name
    sortParameters.active = this.tableColumns.find(column => column.name === sortParameters.active)!.dataKey;
    this.sort.emit(sortParameters);
  }

  onPage(e: PageEvent) {
    this.page.emit({ pageIndex: e.pageIndex, pageSize: e.pageSize });
  }

  onEdit(id: any) {
    this.edit.emit(id);
  }

  onDelete(id: any) {
    this.delete.emit(id);
  }

  openDialog(id:any){
    this.openDialogDetails.emit(id);
  }
}
