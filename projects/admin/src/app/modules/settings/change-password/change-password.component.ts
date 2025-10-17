import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AuthService, ProfileService } from 'DAL';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatButtonModule,
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
