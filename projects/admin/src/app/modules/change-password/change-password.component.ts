import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService, FieldErrorDirective, ProfileService } from 'DAL';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatButtonModule,
    MatCardModule,
    TranslatePipe,
    FieldErrorDirective
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
  constructor(private fb: FormBuilder, private profileSerive: ProfileService) {}

  changePasswordForm!: FormGroup;
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.changePasswordForm.value)
    this.profileSerive.changePassword(this.changePasswordForm.value).subscribe({
      next:(res:any)=>{
        console.log(res);
      }
    })
  }
}
