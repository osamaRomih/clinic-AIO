import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CommonModule, FormatWidth } from '@angular/common';
import { IPatientActiveRead, IPatientRead, IPrescription, IPrescriptionDetails, PatientService, PrescriptionService, SnackbarService } from 'DAL';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-update-prescription',
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
    MatSelectModule,
  ],
  templateUrl: './update-prescription.component.html',
  styleUrl: './update-prescription.component.scss',
})
export class UpdatePrescriptionComponent implements OnInit, OnDestroy {
  html = '';
  editor!: Editor;

  private snackbarService = inject(SnackbarService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private prescriptionService = inject(PrescriptionService);
  private patientService = inject(PatientService);
  private fb = inject(FormBuilder);

  prescriptionForm!: FormGroup;
  medicationForm!: FormGroup;
  id!: number;
  prescription!: IPrescriptionDetails;
  patients: IPatientActiveRead[] = [];

  ngOnInit(): void {
    this.editor = new Editor();
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.initForm();
    this.initMedicationForm();
    this.loadPatients();
    this.loadPrescription();
  }

  createForm() {
    this.prescriptionForm = this.fb.group({
      patientId: [this.prescription?.patient.id || '', Validators.required],
      date: [new Date(this.prescription?.date) || '', Validators.required],
      age: [this.prescription?.age || '', Validators.required],
      diagnosis: [this.prescription?.diagnosis || '', Validators.required],
      notes: [this.prescription?.notes || ''],
      items: this.fb.array([]),
    });
  }

  initForm() {
    this.prescriptionForm = this.fb.group({
      patientId: [''],
      date: [''],
      age: [''],
      diagnosis: [''],
      nextVisit: [''],
      notes: [''],
      items: this.fb.array([]),
    });
  }

  initMedicationForm() {
    this.medicationForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: [0, Validators.required],
      days: [0, Validators.required],
      instructions: [''],
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

  populateMedications() {
    const medicationArray = this.prescriptionForm.get('items') as FormArray;
    medicationArray.clear();

    if (!this.prescription?.items || !Array.isArray(this.prescription.items)) return;

    this.prescription.items.forEach((med) => {
      medicationArray.push(
        this.fb.group({
          id: [med.id],
          name: [med.name, [Validators.required]],
          dosage: [med.dosage, [Validators.required]],
          frequency: [med.frequency, [Validators.required]],
          days: [med.days, [Validators.required]],
          instructions: [med.instructions || ''],
        }),
      );
    });
  }

  loadPrescription() {
    this.prescriptionService.getById(this.id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.prescription = res;
        this.createForm();
        this.populateMedications();
      },
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get medications(): FormArray<FormGroup> {
    return this.prescriptionForm.get('items') as FormArray<FormGroup>;
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
    this.snackbarService.error('Medication removed');
  }

  onSubmit() {
    const formValue = this.prescriptionForm.value;

    const formattedValue = {
      ...formValue,
      date: moment(formValue.date).format('YYYY-MM-DD'),
      nextVisit: moment(formValue.nextVisit).format('YYYY-MM-DD'),
    };

    this.prescriptionService.update(this.id, formattedValue).subscribe({
      next: (res) => {
        this.snackbarService.success('Prescription updated successfully');
        this.router.navigate(['/prescriptions']);
      },
    });
  }
}
