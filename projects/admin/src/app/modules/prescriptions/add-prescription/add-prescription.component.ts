import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FieldErrorDirective, PrescriptionService } from 'DAL';
import moment from 'moment';
@Component({
  selector: 'app-add-prescription',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    MatDatepickerModule,
    MatError,
    MatInput,
    MatIconButton,
    CommonModule,
    MatIconModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatLabel,
    MatButton,
    FieldErrorDirective,
  ],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.scss',
})
export class AddPrescriptionComponent implements OnInit, OnDestroy {
  html = '';
  editor!: Editor;

  constructor(private service: PrescriptionService, private fb: FormBuilder) {}

  prescriptionForm!: FormGroup;
  medicationForm!: FormGroup;

  ngOnInit(): void {
    this.editor = new Editor();
    this.createForm();
    this.createMedicationForm();
  }

  private minArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !(control instanceof FormArray)) return null;
      return control.length >= min
        ? null
        : { minArrayLength: { required: min, actual: control.length } };
    };
  }

  createForm() {
    this.prescriptionForm = this.fb.group({
      patientId: [null, [Validators.required, Validators.min(1)]],
      date: [null, [Validators.required]],
      age: [
        null,
        [Validators.required, Validators.min(0), Validators.max(120)],
      ],
      diagnosis: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(1000),
        ],
      ],
      nextVisit: [null, [Validators.required]],
      notes: ['', [Validators.maxLength(2000)]],
      medications: this.fb.array([], [this.minArrayLength(1)]),
    });
  }

  createMedicationForm() {
    // Correct validator arrays for each control
    this.medicationForm = this.fb.group({
      id: [0],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(200),
        ],
      ],
      dosage: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200),
        ],
      ],
      frequency: [
        1,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      days: [1, [Validators.required, Validators.min(1), Validators.max(365)]],
      instructions: ['', [Validators.maxLength(1000)]],
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get medications(): FormArray<FormGroup> {
    return this.prescriptionForm.get('medications') as FormArray<FormGroup>;
  }

  // Adds a new medication row
  addToTable() {
    if (this.medicationForm.valid) {
      this.medications.push(this.fb.group(this.medicationForm.value));
      this.medicationForm.reset();
    }
  }

  // Remove medication row
  removeMedication(index: number): void {
    this.medications.removeAt(index);
    // this.toastr.warning('Medication removed');
  }

  onSubmit() {
    const formValue = this.prescriptionForm.value;
    const formattedValue = {
      ...formValue,
      date: moment(formValue.date).format('YYYY-MM-DD'),
      nextVisit: moment(formValue.nextVisit).format('YYYY-MM-DD'),
    };
    console.log('Prescription Submitted:', formattedValue);
    this.service.create(formattedValue).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}

// simple positive integer validator
const positiveInteger: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (control.value == null || control.value === '') return null;
  const v = Number(control.value);
  if (!Number.isInteger(v) || v <= 0) return { positiveInteger: true };
  return null;
};

// numeric range validator (inclusive)
// function range(min: number, max: number): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     if (control.value == null || control.value === '') return null;
//     const v = Number(control.value);
//     if (isNaN(v) || v < min || v > max) return { range: { min, max } };
//     return null;
//   };
// }

// no future dates (date <= today)
const noFutureDate: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  const d = moment(control.value);
  if (!d.isValid()) return { invalidDate: true };
  if (d.isAfter(moment(), 'day')) return { futureDate: true };
  return null;
};

// cross-field: nextVisit must be same or after date
const nextVisitAfterOrEqualDate: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const dateCtrl = group.get('date');
  const nextVisitCtrl = group.get('nextVisit');
  if (!dateCtrl || !nextVisitCtrl) return null;
  const dateVal = dateCtrl.value;
  const nextVal = nextVisitCtrl.value;
  if (!dateVal || !nextVal) return null; // let required validators handle missing
  const d = moment(dateVal);
  const n = moment(nextVal);
  if (!d.isValid() || !n.isValid()) return { invalidDatePair: true };
  if (n.isBefore(d, 'day')) {
    return { nextVisitBeforeDate: true };
  }
  return null;
};

// ensure medication names are unique inside the FormArray
const uniqueMedicationNames: ValidatorFn = (
  ctrl: AbstractControl
): ValidationErrors | null => {
  const arr = ctrl as FormArray;
  const names = arr.controls
    .map((c) => (c.get('name')?.value ?? '').toString().trim().toLowerCase())
    .filter((x) => x);
  const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
  if (duplicates.length > 0) return { duplicateMedicationNames: true };
  return null;
};

// form-array min length validator
function minArrayLength(min: number): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const arr = ctrl as FormArray;
    if (!arr || !Array.isArray(arr.controls)) return null;
    if (arr.length < min)
      return { minArrayLength: { required: min, actual: arr.length } };
    return null;
  };
}
