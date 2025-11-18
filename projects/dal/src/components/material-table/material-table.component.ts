import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TableColumn } from '../../models/table-column';
import { TimeShortPipe } from '../../public-api';
import { debounceTime, distinct, distinctUntilChanged, Subject, Subscription } from 'rxjs';

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
    MatCheckboxModule,
    TimeShortPipe
  ],
  templateUrl: './material-table.component.html',
  styleUrl: './material-table.component.scss'
})
export class MaterialTableComponent implements OnInit, AfterViewInit, OnChanges,OnDestroy {
  public tableDataSource = new MatTableDataSource<any>([]);
  private _displayedColumns: string[] = [];

  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) matSort!: MatSort;

  // inputs
  @Input() title = '';
  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() isExportable = false;
  @Input() enableSelection = false;
  @Input() tableColumns: TableColumn[] = [];
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() pageSize = this.paginationSizes[1];
  @Input() totalItems = 0;
  @Input() showEditDelete = true;
  @Input() isServerSidePagination = false;
  @Input() isServerSideSortable = false;

  // outputs
  @Output() page = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() add = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() search = new EventEmitter<any>();
  @Output() bulkDelete = new EventEmitter<any>();
  @Output() exportExcel = new EventEmitter<any>();
  @Output() openDialogDetails = new EventEmitter<any>();

  private searchSubject = new Subject<string>();
  private searchSubscription :Subscription | undefined;

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

  constructor() {
    this.initSearch();
  }

  private initSearch() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500),// Wait 500ms after the last keystroke
      distinctUntilChanged()// Only emit if the value is different from previous
    ).subscribe(searchValue=>{
      if(this.isServerSidePagination){
        this.search.emit(searchValue);
        if(this.matPaginator)
          this.matPaginator.firstPage();
      }else{
        this.tableDataSource.filter = searchValue.trim().toLowerCase();
      }
    })
  }
  ngOnInit(): void {
    // initial build 
    this.buildDisplayedColumns();
    this.tableDataSource.data = this._tableData ?? [];
  }

  ngAfterViewInit(): void {
    // wire paginator / sort if available
    if (!this.isServerSidePagination && this.matPaginator)
       this.tableDataSource.paginator = this.matPaginator;

    if(!this.isServerSideSortable && this.matSort)
      this.tableDataSource.sort = this.matSort;
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
    if (!this.isServerSidePagination && this.matPaginator) this.tableDataSource.paginator = this.matPaginator;
    if (!this.isServerSideSortable && this.matSort) this.tableDataSource.sort = this.matSort;
  }

  applyFilter(event: Event) {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  sortTable(sortParameters: Sort) {
    const col = this.tableColumns.find(column => column.name === sortParameters.active);

    if (this.isServerSideSortable === false && this.matSort) {
      this.tableDataSource.sort = this.matSort;
    }
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

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'status-booked';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  // Clean up memory to prevent leaks
  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}