import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FieldErrorDirective, IPatientRead, PatientService, PrescriptionService, SnackbarService } from 'DAL';
import moment from 'moment';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
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
    MatSelectModule,
  ],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.scss',
})
export class AddPrescriptionComponent implements OnInit, OnDestroy {
  html = '';
  editor!: Editor;

  private patientService = inject(PatientService);
  private prescriptionService = inject(PrescriptionService);
  private fb = inject(FormBuilder);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);

  prescriptionForm!: FormGroup;
  medicationForm!: FormGroup;
  patients: IPatientRead[] = [];

  ngOnInit(): void {
    this.editor = new Editor();
    this.createForm();
    this.createMedicationForm();
    this.loadPatients();
  }

  createForm() {
    this.prescriptionForm = this.fb.group({
      patientId: [null, [Validators.required, Validators.min(1)]],
      date: [null, [Validators.required]],
      age: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
      diagnosis: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      notes: ['', [Validators.maxLength(2000)]],
      medications: this.fb.array([], [this.minArrayLength(1)]),
    });
  }

  createMedicationForm() {
    // Correct validator arrays for each control
    this.medicationForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      dosage: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      frequency: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
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

  // Adds a new medication row to the medications table
  addToTable() {
    if (this.medicationForm.valid) {
      this.medications.push(this.fb.group(this.medicationForm.value));
      this.medicationForm.reset();
    }
  }

  // Remove medication row
  removeMedication(index: number): void {
    this.medications.removeAt(index);
  }

  onSubmit() {
    const formValue = this.prescriptionForm.value;
    const formattedValue = {
      ...formValue,
      date: moment(formValue.date).format('YYYY-MM-DD'),
      nextVisit: moment(formValue.nextVisit).format('YYYY-MM-DD'),
    };
    this.prescriptionService.create(formattedValue).subscribe({
      next: (res) => {
        this.snackbarService.success('Prescription added successfully');
        this.router.navigate(['/prescriptions']);
      },
    });
  }

  loadPatients() {
    this.patientService.getAllActive().subscribe({
      next: (res) => {
        this.patients = res;
      },
      error: (err) => {
        console.error('Error loading patients', err);
      },
    });
  }

  private minArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !(control instanceof FormArray)) return null;
      return control.length >= min ? null : { minArrayLength: { required: min, actual: control.length } };
    };
  }
}
