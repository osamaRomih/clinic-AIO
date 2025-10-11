import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import moment from 'moment';
import { ITimeSlot, TimeslotService } from 'DAL';
import { ToastrService } from 'ngx-toastr';
import {TimeSlotFormComponent} from '../time-slot-form/time-slot-form.component'

@Component({
  selector: 'app-all-time-slots',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIcon,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './all-time-slots.component.html',
  styleUrl: './all-time-slots.component.scss',
})
export class AllTimeSlotsComponent {
  daysOfWeek: string[] = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  displayedColumns: string[] = ['startTime', 'endTime', 'actions'];
  dataSource!: any;
  selectedDay!: string;
  constructor(
    private dialog: MatDialog,
    private timeSlotService: TimeslotService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.selectedDay = this.daysOfWeek[0];
    this.getAllTimeSlots();
  }

  getAllTimeSlots() {
    this.timeSlotService.getAll(this.selectedDay).subscribe({
      next: (res) => {
        this.dataSource = this.mappingTimeSlots(res);
        console.log(res);
      },
    });
  }

  updateTimeSlot(day: string, timeSlot: ITimeSlot) {
    const dialogRef = this.dialog.open(TimeSlotFormComponent, {
      width: '450px',
      data: {
        day,
        timeSlot,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllTimeSlots();
      }
    });
  }

  deleteTimeSlot(id: number) {
    this.timeSlotService.deleteTimeSlot(id).subscribe({
      next: (res) => {
        this.toastr.success('Time deleted successfully');
        this.getAllTimeSlots();
      },
    });
  }

  openAddTimeDialog(day: string): void {
    const dialogRef = this.dialog.open(TimeSlotFormComponent, {
      width: '450px',
      data: {
        day,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllTimeSlots();
      }
    });
  }

  onTabChange(event: any) {
    this.selectedDay = this.daysOfWeek[event.index];
    this.getAllTimeSlots();
  }

  mappingTimeSlots(times: ITimeSlot[]) {
    let sortedTimes = times.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
      const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
      return timeA - timeB;
    });

    return sortedTimes.map((item) => {
      return {
        id: item.id,
        startTime: moment(item.startTime, 'HH:mm:ss').format('hh:mm A'),
        endTime: moment(item.endTime, 'HH:mm:ss').format('hh:mm A'),
      };
    });
  }
}
