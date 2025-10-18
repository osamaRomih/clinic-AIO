import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IRoleResponse, RoleService, UserService } from 'DAL';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    NgxMaterialTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    ReactiveFormsModule,
    MatButton,
    MatSelectModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private dialog:MatDialogRef<AddUserComponent>
  ) {}
  userForm!: FormGroup;
  roles:IRoleResponse[] = [];

  ngOnInit(): void {
    this.createForm();

    this.getAllRoles();
  }

  getAllRoles() {
    this.roleService.getAll().subscribe({
      next: (res) => {
        this.roles = res;
      },
    });
  }

  createForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      userName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      roles: [[], [Validators.required]],
    });
  }

  closeDiaglog() {
    this.dialog.close();
  }
  addUser() {
    console.log(this.userForm.value)
    this.userService.add(this.userForm.value).subscribe({
      next: (res) => {
        this.dialog.close(true);
      },
    });
  }
}
