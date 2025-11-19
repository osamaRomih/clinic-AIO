import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  AppointmentService,
  IPatientRead,
  PatientService,
  SnackbarService,
  TimeSlotResponse,
  TimeslotService,
  FieldErrorDirective,
} from 'DAL';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-appointment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    CommonModule,
    FieldErrorDirective,
  ],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent implements OnInit {
  timeSlots: TimeSlotResponse[] = [];
  appointmentForm!: FormGroup;
  patients: IPatientRead[] = [];

  private timeSlotService = inject(TimeslotService);
  private appointmentService = inject(AppointmentService)
  private patientService = inject(PatientService);
  private snackBarService = inject(SnackbarService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
    this.loadPatients();
    this.loadTimeSlots();
  }

  createForm() {
    this.appointmentForm = this.fb.group({
      patientId: [null, [Validators.required]],
      timeSlotId: [null, [Validators.required]],
      date: ['', [Validators.required]],
      reasonForVisit: ['', [Validators.required]],
      visitType: ['', [Validators.required]],
    });
  }

  loadTimeSlots() {
    this.timeSlotService.getAll().subscribe();
  }

  filterTimeSlotsByDate(event: MatDatepickerInputEvent<Date>) {
    if (!event.value) return;
    const day = moment(event.value).format('dddd');
    this.timeSlots = this.timeSlotService.timeSlots().find((slots) => slots.day === day)?.timeSlots || [];
  }

  loadPatients() {
    this.patientService.getAllActive().subscribe({
      next: (res) => {
        this.patients = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    const { date, ...rest } = this.appointmentForm.value;
    const model = {
      ...rest,
      date: moment(date).format('YYYY-MM-DD'),
      doctorId: '57ff9f9a-6b56-4c6b-beeb-62cf2c6fd66e', // TODO:Change it to doctor id
    };
    this.appointmentService.create(model).subscribe({
      next: () => {
        this.snackBarService.success('The appointment added successfully');
        this.router.navigateByUrl('/appointments');
      },
      error: () => {},
    });
  }
}
