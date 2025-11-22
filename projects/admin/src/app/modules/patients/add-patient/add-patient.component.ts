import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FieldErrorDirective, PatientService, SnackbarService } from 'DAL';
import moment from 'moment';

@Component({
  selector: 'app-add-patient',
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
    MatButtonModule,
    FieldErrorDirective,
    MatSelectModule,
    TranslatePipe,
    
  ],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss',
})
export class AddPatientComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);
  private patientService = inject(PatientService);
  private translateService = inject(TranslateService);


  patientForm!: FormGroup;
  imageFile?: File | null;
  imageSrc: string | ArrayBuffer | null = null;
  defaultAvatar = 'assets/images/user.png';

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.patientForm = this.fb.group({
      fullName: [null, [Validators.required, Validators.minLength(3)]],
      gender: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      address: [null],
      userName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      phoneNumber: [null, [Validators.required]],
      image: [null],
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

    this.patientService.create(formData).subscribe({
      next: () => {
        const successMsg = this.translateService.instant('PATIENTS.MESSAGES.SUBMIT_SUCCESS')
        this.snackbarService.success(successMsg);
        this.router.navigate(['patients']);
      },
      error: () => {
        const errorMsg = this.translateService.instant('PATIENTS.MESSAGES.SUBMIT_FAILED');
        this.snackbarService.error(errorMsg)
      }
    });
  }
}
