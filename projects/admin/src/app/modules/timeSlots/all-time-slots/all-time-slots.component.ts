import { Component } from '@angular/core';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import moment from 'moment';
import { DaySlotsResponse, ITimeSlot, TimeslotService } from 'DAL';
import { ToastrService } from 'ngx-toastr';
import {TimeSlotFormComponent} from '../time-slot-form/time-slot-form.component'
import {MatTabGroup, MatTabsModule} from '@angular/material/tabs';


@Component({
  selector: 'app-all-time-slots',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTabsModule,
    MatIcon,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
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
  timeSlots!: DaySlotsResponse[];
  
  constructor(
    private dialog: MatDialog,
    private timeSlotService: TimeslotService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllTimeSlots();
  }

  getAllTimeSlots() {
    this.timeSlotService.getAll().subscribe({
      next: (res) => {
        this.timeSlots = res.slots;
      },
    });
  }

  getTimeSlotsByDay(day:string){
    if (!this.timeSlots) return [];
    var result = this.timeSlots.find(x=>x.day==day);
    return result ? result.timeSlots : [];
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


  formatTime(time:any){
    return moment(time,'HH:mm:ss').format('hh:mm A')
  }

}
