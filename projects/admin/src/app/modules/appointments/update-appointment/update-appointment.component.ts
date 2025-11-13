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
  IActivePatient,
  IAppointment,
  IAppointmentRead,
  PatientService,
  ScheduleResponse,
  SnackbarService,
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
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './update-appointment.component.html',
  styleUrl: './update-appointment.component.scss',
})
export class UpdateAppointmentComponent implements OnInit {
  timeSlots: TimeSlotResponse[] = [];
  appointmentForm!: FormGroup;
  patients: IActivePatient[] = [];
  filteredPatients: Observable<IActivePatient[]> | undefined;
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

  filterPatients(fullName: string): IActivePatient[] {
    let arr = this.patients.filter(
      (patient) =>
        patient.fullName.toLowerCase().indexOf(fullName.toLowerCase()) === 0
    );

    return arr.length
      ? arr
      : [{ fullName: 'No Item found', id: 0, imageUrl: '', phoneNumber: '' }];
  }
  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();

    this.loadPatients();
    this.loadAppointment();
  }

  initForm() {
    this.appointmentForm = this.fb.group({
      patientSearch: [''],
      patientId: [null],
      timeSlotId: [null],
      date: [null],
      reasonForVisit: [''],
      visitType: [''],
    });
  }

  createForm() {
    this.appointmentForm = this.fb.group({
      patientSearch: [this.appointment.patientName],
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
        const date = moment(this.appointment.date).format("YYYY-MM-DD");
        this.getTimesByDate(date);
      },
    });
  }

  // get time slots when click to day in calender
  getTimeSlots(event: MatDatepickerInputEvent<Date>) {
    if (!event.value) return;

    const date = moment(event.value).format('YYYY-MM-DD');
    this.getTimesByDate(date);
  }

  getTimesByDate(date:string){
    this.timeSlotService.getAll(date).subscribe({
      next: (res) => {
        this.timeSlots = res.slots.length > 0 ? res.slots[0].timeSlots : [];
        this.createForm();
        console.log(this.appointmentForm.value)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadPatients() {
    this.patientService.getAllActive().subscribe({
      next: (res) => {
        this.patients = res;
        this.bindPatientSearch();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onPatientSelected(e: MatAutocompleteSelectedEvent) {
    const p = e.option.value as IActivePatient;
    this.appointmentForm.patchValue(
      {
        patientSearch: p.fullName,
        patientId: p.id,
      },
      { emitEvent: false }
    );
  }

  onSubmit() {
    const { patientSearch, date, ...rest } = this.appointmentForm.value;
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

  private bindPatientSearch() {
    this.filteredPatients = this.appointmentForm
      .get('patientSearch')
      ?.valueChanges.pipe(
        startWith(this.appointmentForm.get('patientSearch')!.value ?? ''),
        map((value) => (value ?? '').toString().toLowerCase().trim()),
        map((term) =>
          this.patients.filter((p) => p.fullName.toLowerCase().includes(term))
        )
      );

    // if user edits text manually after selection, clear patientId to avoid stale ids
    this.appointmentForm.get('patientSearch')!.valueChanges.subscribe((val) => {
      const current = this.appointmentForm.get('patientId')!.value;
      if (typeof val === 'string')
        this.appointmentForm
          .get('patientId')!
          .setValue(null, { emitEvent: false });
    });
  }
}
