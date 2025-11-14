import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn } from '../interfaces/TableColumn';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { DataPropertyGetterPipe } from "../data-property-getter-pipe/data-property-getter.pipe";
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from "@angular/material/checkbox";

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
    DataPropertyGetterPipe,
    MatCheckboxModule
  ],
  templateUrl: './material-table.component.html',
  styleUrl: './material-table.component.css'
})
export class MaterialTableComponent implements OnInit, AfterViewInit, OnChanges {
  public tableDataSource = new MatTableDataSource<any>([]);
  private _displayedColumns: string[] = [];

  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) matSort!: MatSort;

  // inputs
  @Input() title = '';
  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() enableSelection = true;
  @Input() tableColumns: TableColumn[] = [];
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];
  @Input() totalItems = 0;
  @Input() showEditDelete = true;

  // outputs
  @Output() page = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() add = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() bulkDelete = new EventEmitter<any>();
  @Output() exportExcel = new EventEmitter<any>();
  @Output() openDialogDetails = new EventEmitter<any>();

  // backing field for tableData
  private _tableData: any[] = [];
  @Input() set tableData(data: any[]) {
    this._tableData = data ?? [];
    this.tableDataSource.data = this._tableData;
    this.buildDisplayedColumns();
  }
  get tableData(): any[] {
    return this._tableData;
  }

  // multi-select
  selection = new SelectionModel<any>(true, []);

  constructor() {}

  ngOnInit(): void {
    // initial build 
    this.buildDisplayedColumns();
    this.tableDataSource.data = this._tableData ?? [];
  }

  ngAfterViewInit(): void {
    // wire paginator / sort if available
    if (this.matPaginator) this.tableDataSource.paginator = this.matPaginator;
    if (this.matSort) this.tableDataSource.sort = this.matSort;
  }

  ngOnChanges(changes: SimpleChanges) {
    // if columns changed, rebuild displayed columns
    if (changes['tableColumns']) {
      this.buildDisplayedColumns();
    }
    // if selection setting changed, rebuild too
    if (changes['enableSelection'] || changes['showEditDelete']) {
      this.buildDisplayedColumns();
    }
  }

  private buildDisplayedColumns() {
    // use dataKey as matColumnDef 
    const cols = this.tableColumns?.map(c => c.dataKey) ?? [];
    const displayed = [...cols];

    // put select at start if selection enabled
    if (this.enableSelection) {
      if (!displayed.includes('select')) displayed.unshift('select');
    }

    // add actions at end if required
    if (this.showEditDelete && !displayed.includes('actions')) {
      displayed.push('actions');
    }

    this._displayedColumns = displayed;
  }

  // used in template
  getDisplayedColumns(): string[] {
    return this._displayedColumns;
  }

  // pagination
  setTableDataSource(data: any) {
    this.tableDataSource.data = data ?? [];
    if (this.matPaginator) this.tableDataSource.paginator = this.matPaginator;
    if (this.matSort) this.tableDataSource.sort = this.matSort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // if server-side filtering, you may want to emit and not set datasource.filter
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  sortTable(sortParameters: Sort) {
    // map header active to dataKey before emitting (guarding undefined)
    const col = this.tableColumns.find(column => column.name === sortParameters.active);
    if (col) {
      const mapped: Sort = { ...sortParameters, active: col.dataKey };
      this.sort.emit(mapped);
    } else {
      this.sort.emit(sortParameters);
    }
  }

  onPage(e: PageEvent) {
    this.page.emit({ pageIndex: e.pageIndex, pageSize: e.pageSize });
  }

  onAdd() { this.add.emit(); }
  onEdit(id: any) { this.edit.emit(id); }
  onDelete(id: any) { this.delete.emit(id); }
  exportAsExcel() { this.exportExcel.emit(); }
  confirmBulkDelete() { this.bulkDelete.emit(this.selection.selected);this.selection.clear() }
  openDialog(id: any) { this.openDialogDetails.emit(id); }

  // selection helpers
  toggleAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      (this.tableData || []).forEach(row => this.selection.select(row));
    }
  }

  checkboxLabel(row?: any): string {
    return row ? `${this.selection.isSelected(row) ? 'deselect' : 'select'} row` : `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = (this.tableData || []).length;
    return numSelected === numRows && numRows > 0;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : (this.tableData || []).forEach((row) => this.selection.select(row));
  }
  getValue(obj:any,path:string){
    return obj[path];
  }
}
