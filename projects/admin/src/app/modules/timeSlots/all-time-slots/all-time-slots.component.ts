import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import moment from 'moment';
import { DaySlotsResponse,TimeSlotResponse, TimeslotService } from 'DAL';
import { ToastrService } from 'ngx-toastr';
import { TimeSlotFormComponent } from '../time-slot-form/time-slot-form.component';

@Component({
  selector: 'app-all-time-slots',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './all-time-slots.component.html',
  styleUrls: ['./all-time-slots.component.scss'],
})
export class AllTimeSlotsComponent implements AfterViewInit {
  daysOfWeek: string[] = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  timeSlots!: DaySlotsResponse[];

  // columns for the mat-table
  displayedColumns: string[] = ['startTime', 'endTime', 'actions'];

  // map each day to a MatTableDataSource so we can bind directly in template
  dataSourceMap: Record<string, MatTableDataSource<TimeSlotResponse>> = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private timeSlotService: TimeslotService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllTimeSlots();
  }

  ngAfterViewInit(): void {
    // if we already have loaded data before view init, attach paginator/sort now
    Object.values(this.dataSourceMap).forEach((ds) => {
      ds.paginator = this.paginator;
      ds.sort = this.sort;
    });
  }

  // load from API and populate dataSourceMap
  getAllTimeSlots() {
    this.timeSlotService.getAll().subscribe({
      next: (res) => {
        this.timeSlots = res.slots ?? [];

        this.daysOfWeek.forEach((day) => {
          const found = this.timeSlots.find((x) => x.day === day);
          const arr = found ? (found.timeSlots ?? []) : [];
          if (this.dataSourceMap[day]) {
            this.dataSourceMap[day].data = [...arr];
          } else {
            const ds = new MatTableDataSource<TimeSlotResponse>(arr);
            // default filter predicate: search start/end time (string)
            ds.filterPredicate = (data: TimeSlotResponse, filter: string) => {
              const f = filter.trim().toLowerCase();
              const s = (this.formatTime(data.startTime) ?? '').toString().toLowerCase();
              const e = (this.formatTime(data.endTime) ?? '').toString().toLowerCase();
              return s.includes(f) || e.includes(f);
            };

            ds.paginator = this.paginator ?? null!;
            ds.sort = this.sort ?? null!;
            this.dataSourceMap[day] = ds;
          }
        });
      },
      error: (err) => {
        console.error('Failed to load time slots', err);
      },
    });
  }

  getTimeSlotsByDay(day: string) {
    return this.dataSourceMap[day] ? this.dataSourceMap[day].data : [];
  }

  openAddTimeDialog(day: string): void {
    const dialogRef = this.dialog.open(TimeSlotFormComponent, {
      width: '450px',
      data: { day },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllTimeSlots();
      }
    });
  }

  updateTimeSlot(day: string, timeSlot: TimeSlotResponse) {
    if (timeSlot.isBooked) {
      this.toastr.warning('This time slot is already booked.');
      return;
    }

    const dialogRef = this.dialog.open(TimeSlotFormComponent, {
      width: '450px',
      data: { day, timeSlot },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllTimeSlots();
      }
    });
  }

  deleteTimeSlot(id: number) {
    // optimistic: confirm on UI level if needed
    this.timeSlotService.deleteTimeSlot(id).subscribe({
      next: () => {
        this.toastr.success('Time deleted successfully');
        this.getAllTimeSlots();
      },
      error: (err) => {
        this.toastr.error('Failed to delete time slot');
        console.error(err);
      },
    });
  }

  // format time string using moment 
  formatTime(time: any) {
    if (!time) return '';
    return moment(time, 'HH:mm:ss').format('hh:mm A');
  }

  // apply filter to a specific day's datasource
  applyFilter(evt: any, day: string) {
    const ds = this.dataSourceMap[day];
    if (!ds) return;
    ds.filter = (evt.target.value).trim().toLowerCase();
    // reset paginator to first page on filter
    if (ds.paginator) ds.paginator.firstPage();
  }

  clearFilter(day: string) {
    const ds = this.dataSourceMap[day];
    if (!ds) return;
    ds.filter = '';
  }

  onRowClick(row: TimeSlotResponse) {
    if (row.isBooked) return;
    this.updateTimeSlot('', row);
  }
}
