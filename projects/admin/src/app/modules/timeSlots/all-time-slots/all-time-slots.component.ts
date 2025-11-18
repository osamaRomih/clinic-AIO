import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DialogService,
  MaterialTableComponent,
  SnackbarService,
  TableColumn,
  TimeSlotResponse,
  TimeslotService,
} from 'DAL';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { TimeSlotFormComponent } from '../time-slot-form/time-slot-form.component';

@Component({
  selector: 'app-all-time-slots',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MaterialTableComponent,
  ],
  templateUrl: './all-time-slots.component.html',
  styleUrls: ['./all-time-slots.component.scss'],
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

  timeSlotsTableColumns!: TableColumn[];
  timeSlotService = inject(TimeslotService);
  dialog = inject(MatDialog);
  snackBarService = inject(SnackbarService);
  confirmationService = inject(DialogService);

  selectedDay = signal<string>('');

  ngOnInit(): void {
    this.getAllTimeSlots();
    this.initColumns();

    this.selectedDay.set(this.daysOfWeek[0]);
  }

  getAllTimeSlots() {
    this.timeSlotService.getAll(undefined, true).subscribe();
  }

  onTabChange(index: number) {
    this.selectedDay.set(this.daysOfWeek[index]);
  }

  onAdd(): void {
    const day = this.selectedDay();
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

  onEdit(id: number) {
    const day = this.selectedDay();
    const timeSlot = this.timeSlotService
      .timeSlotsByDay()
      [day].find((ts) => ts.id == id);
    if (!timeSlot) return;

    if (timeSlot.isBooked) {
      this.snackBarService.error('This time slot is already booked.');
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


  onDelete(id: number) {
    // optimistic: confirm on UI level if needed
    this.confirmationService
      .confirmDialog({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to toggle this time slot status?',
        cancelCaption: 'No',
        confirmCaption: 'Yes',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.timeSlotService.toggleStatus(id).subscribe({
            next: () => {
              this.snackBarService.success('Time is toggled successfully');
              this.getAllTimeSlots();
            },
            error: (err) => {
              this.snackBarService.error('Failed to toggle time slot status');
              console.error(err);
            },
          });
        }
      });
  }

  onRowClick(row: TimeSlotResponse) {
    if (row.isBooked) return;
    this.onEdit(row.id);
  }

  initColumns(): void {
    this.timeSlotsTableColumns = [
      {
        name: 'Start Time',
        dataKey: 'startTime',
        isSortable: true,
      },
      {
        name: 'End Time',
        dataKey: 'endTime',
        isSortable: true,
      },
      {
        name: 'Status',
        dataKey: 'isBooked',
        isSortable: true,
      },
      {
        name: 'IsDeleted',
        dataKey: 'isDeleted',
        isSortable: true,
      },
      {
        name: 'Booked At',
        dataKey: 'bookedAt',
        isSortable: true,
      }
    ];
  }
}
