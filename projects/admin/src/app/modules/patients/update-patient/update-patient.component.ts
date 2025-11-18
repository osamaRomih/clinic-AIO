import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldErrorDirective, PatientService, SnackbarService } from 'DAL';
import moment from 'moment';

@Component({
  selector: 'app-update-patient',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    MatDatepickerModule,
    MatError,
    MatInput,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatLabel,
    MatButton,
    FieldErrorDirective,
    MatSelectModule,
  ],
  templateUrl: './update-patient.component.html',
  styleUrl: './update-patient.component.scss',
})
export class UpdatePatientComponent {
  private patientService = inject(PatientService);
  private fb = inject(FormBuilder);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  patientId!: string;
  patientForm!: FormGroup;
  imageFile?: File | null;
  imageSrc: string | ArrayBuffer | null = null;
  defaultAvatar = 'assets/images/user.png';

  ngOnInit(): void {
    this.initForm();
    this.loadPatientData();
  }

  loadPatientData() {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';

    this.patientService.getById(this.patientId).subscribe({
      next: (patient) => {
        this.patientForm.patchValue({
          firstName: patient.firstName,
          lastName: patient.lastName,
          gender: patient.gender,
          dateOfBirth: moment(patient.dateOfBirth).toDate(),
          address: patient.address,
          userName: patient.userName,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
        });
        if (patient.imageUrl) this.imageSrc = patient.imageUrl;
      },
    });
  }

  initForm() {
    this.patientForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      gender: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      address: [null],
      userName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      const file = target.files[0];
      this.imageFile = file;
      var reader = new FileReader();

      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imageSrc = null;
  }

  onSubmit() {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    Object.keys(this.patientForm.value).forEach((key) => {
      const formValue = this.patientForm.value[key];

      if (key === 'dateOfBirth') formData.append(key, moment(formValue).format('YYYY-MM-DD'));
      else formData.append(key, formValue);
    });

    if (this.imageFile) formData.append('image', this.imageFile);

    this.patientService.update(this.patientId, formData).subscribe({
      next: () => {
        this.snackbarService.success('Patient updated successfully');
        this.router.navigate(['patients']);
      },
      error: () => this.snackbarService.error('Failed to update patient'),
    });
  }
}
