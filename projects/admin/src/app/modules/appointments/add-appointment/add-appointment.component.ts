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
  IActivePatient,
  PatientService,
  ScheduleResponse,
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
@Component({
  selector: 'app-add-appointment',
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
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent implements OnInit {
  timeSlots: TimeSlotResponse[] = [];
  appointmentForm!: FormGroup;
  patients: IActivePatient[] = [];
  filteredPatients: Observable<IActivePatient[]> | undefined;

  constructor(
    private timeSlotService: TimeslotService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {}

  filterPatients(fullName: string): IActivePatient[] {
    let arr = this.patients.filter(
      (patient) =>
        patient.fullName.toLowerCase().indexOf(fullName.toLowerCase()) === 0
    );

    return arr.length ? arr : [{ fullName: 'No Item found', id: 0,imageUrl:'',phoneNumber:'' }];
  }
  ngOnInit(): void {
    this.createForm();
    this.loadPatients();
  }

  createForm() {
    this.appointmentForm = this.fb.group({
      patientSearch: [''],
      patientId: [null, [Validators.required]],
      timeSlotId: [null, [Validators.required]],
      date: ['', [Validators.required]],
      reasonForVisit: ['', [Validators.required]],
      visitType: ['', [Validators.required]],
    });
  }

  getTimeSlots(event: MatDatepickerInputEvent<Date>) {
    if (!event.value) return;

    const date = moment(event.value).format('YYYY-MM-DD');
    this.timeSlotService.getAll(date).subscribe({
      next: (res) => {
        this.timeSlots = res.slots.length > 0 ? res.slots[0].timeSlots : [];
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
    const model = {
      ...rest,
      date: moment(date).format('YYYY-MM-DD'),
      doctorId: 1,
    };
    this.appointmentService.create(model).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  private bindPatientSearch() {
    this.filteredPatients = this.appointmentForm.get('patientSearch')?.valueChanges.pipe(
        startWith(''),
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
