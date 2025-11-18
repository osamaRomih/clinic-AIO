import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITimeSlot, SnackbarService, TimeslotService } from 'DAL';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-slot-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    NgxMaterialTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    ReactiveFormsModule,
    MatButton,CommonModule
  ],
  templateUrl: './time-slot-form.component.html',
  styleUrl: './time-slot-form.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class TimeSlotFormComponent implements OnInit {
  timeSlotForm!: FormGroup;

  private dialogRef = inject(MatDialogRef<TimeSlotFormComponent>);
  private fb = inject(FormBuilder);
  private timeSlotService = inject(TimeslotService);
  private snackBarService = inject(SnackbarService);
  protected data = inject<{ day: string; timeSlot?: ITimeSlot }>(MAT_DIALOG_DATA);

  
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.timeSlotForm = this.fb.group({
      startTime: [this.data?.timeSlot?.startTime || '', [Validators.required]],
      endTime: [this.data?.timeSlot?.endTime || '', [Validators.required]],
    });
  }

  closeDiaglog() {
    this.dialogRef.close();
  }

  // add time slot
  addTimeSlot() {
    const { startTime, endTime } = this.timeSlotForm.value;
    let model: ITimeSlot = {
      startTime,
      endTime,
    };

    this.timeSlotService.addTimeSlot(model, this.data?.day!).subscribe({
      next: (res) => {
        this.snackBarService.success('Time is created successfully!');
        this.dialogRef.close(true);
      },
    });
  }

  // update time slot
  updateTimeSlot(id: number) {
    const { startTime, endTime } = this.timeSlotForm.value;

    let model: ITimeSlot = {
      startTime: startTime.substring(0, 5),
      endTime: endTime.substring(0, 5),
    };

    this.timeSlotService.updateTimeSlot(id, model).subscribe({
      next: (res) => {
        this.snackBarService.success('Time is updated successfully!');
        this.dialogRef.close(true);
      },
    });
  }
}
