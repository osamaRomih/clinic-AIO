import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogService, MaterialTableComponent, SnackbarService, TableColumn, TimeslotService } from 'DAL';
import { TimeSlotFormComponent } from '../time-slot-form/time-slot-form.component';

@Component({
  selector: 'app-all-time-slots',
  standalone: true,
  imports: [MatTabsModule, MaterialTableComponent],
  templateUrl: './all-time-slots.component.html',
  styleUrls: ['./all-time-slots.component.scss'],
})
export class AllTimeSlotsComponent {
  timeSlotsTableColumns!: TableColumn[];

  protected timeSlotService = inject(TimeslotService);
  private dialog = inject(MatDialog);
  private snackBarService = inject(SnackbarService);
  private confirmationService = inject(DialogService);

  selectedDay = signal<string>('');

  ngOnInit(): void {
    this.getAllTimeSlots();
    this.initColumns();
    this.selectedDay.set(this.timeSlotService.dayOfWeek[0]);
  }

  getAllTimeSlots() {
    this.timeSlotService.getAll(true).subscribe();
  }

  onTabChange(index: number) {
    this.selectedDay.set(this.timeSlotService.dayOfWeek[index]);
  }

  // add time slot
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

  // edit time slot
  onEdit(id: number) {
    const day = this.selectedDay();
    const timeSlot = this.timeSlotService.timeSlotsByDay()[day].find((ts) => ts.id == id);
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

  // delete time slot
  onDelete(id: number) {
    this.confirmationService.confirmDialog('Confirm Deletion', 'Are you sure you want to toggle this time slot status?').subscribe((confirmed) => {
      if (confirmed) {
        this.timeSlotService.toggleStatus(id).subscribe({
          next: () => {
            this.snackBarService.success('Time is toggled successfully');
            this.getAllTimeSlots();
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
    });
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
      },
    ];
  }
}
