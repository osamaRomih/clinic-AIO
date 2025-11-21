import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
} from '@angular/material/card';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter, MatOption } from '@angular/material/core';
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
  AuthService,
  IAppointment,
  IAppointmentRead,
  IPatientActiveRead,
  IPatientRead,
  PatientService,
  ScheduleResponse,
  SnackbarService,
  TimeShortPipe,
  TimeSlotResponse,
  TimeslotService,
} from 'DAL';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-appointment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    TimeShortPipe,
    CommonModule,
  ],
  templateUrl: './update-appointment.component.html',
  styleUrl: './update-appointment.component.scss',
})
export class UpdateAppointmentComponent implements OnInit {
  timeSlots: TimeSlotResponse[] = [];
  appointmentForm!: FormGroup;
  patients: IPatientActiveRead[] = [];
  appointment!: IAppointment;
  appointmentId!: number;
  constructor(
    private timeSlotService: TimeslotService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private snackBarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();

    this.loadPatients();
    this.loadTimeSlots();
    this.loadAppointment();

  }

  initForm() {
    this.appointmentForm = this.fb.group({
      patientId: [null],
      timeSlotId: [null],
      date: [null],
      reasonForVisit: [''],
      visitType: [''],
    });
  }

  createForm() {
    this.appointmentForm = this.fb.group({
      patientId: [this.appointment.patientId, [Validators.required]],
      timeSlotId: [this.appointment.timeSlotId, [Validators.required]],
      date: [this.appointment.date, [Validators.required]],
      reasonForVisit: [this.appointment.reasonForVisit, [Validators.required]],
      visitType: [this.appointment.visitType, [Validators.required]],
    });
  }

  loadAppointment() {
    this.appointmentService.getById(this.appointmentId).subscribe({
      next: (res: any) => {
        this.appointment = res;
        this.getTimeSlotsByDate(this.appointment.date);
        this.createForm();
        console.log(this.appointmentForm.value)
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getTimeSlotsByDate(date: string) {
    const day = moment(date).format('dddd');
    this.timeSlots = this.timeSlotService.timeSlots().find((slots) => slots.day === day)?.timeSlots || [];
  }

  loadTimeSlots() {
    this.timeSlotService.getAll().subscribe();
  }

  filterTimeSlotsByDate(event: MatDatepickerInputEvent<Date>) {
    if (!event.value) return;
    this.getTimeSlotsByDate(moment(event.value).format('YYYY-MM-DD'));
  }

  loadPatients() {
    this.patientService.getAllActive().subscribe({
      next: (res) => {
        console.log(res)
        this.patients = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    const { date, ...rest } = this.appointmentForm.value;
    console.log(this.appointmentForm.value)
    const model = {
      ...rest,
      date: moment(date).format('YYYY-MM-DD'),
      doctorId: '57ff9f9a-6b56-4c6b-beeb-62cf2c6fd66e', // TODO:Change it to doctor id
    };
    this.appointmentService.update(this.appointmentId, model).subscribe({
      next: () => {
        this.snackBarService.success('The appointment added successfully');
        this.router.navigateByUrl('/appointments');
      },
      error: () => {},
    });
  }
}
