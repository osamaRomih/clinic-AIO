import { Component, Inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
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
import { IRoleResponse, IUserRead, RoleService, UserService } from 'DAL';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-update-user',
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
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss',
})
export class UpdateUserComponent {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private dialog: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUserRead
  ) {}

  userForm!: FormGroup;
  roles: IRoleResponse[] = [];

  ngOnInit(): void {
    this.createForm();
    this.getAllRoles();
  }

  createForm() {
    this.userForm = this.fb.group({
      firstName: [this.data.firstName, [Validators.required]],
      lastName: [this.data.lastName],
      phoneNumber: [this.data.phoneNumber, [Validators.required]],
      userName: [this.data.userName, [Validators.required]],
      email: [this.data.email, [Validators.required, Validators.email]],
      roles: [this.data.roles || [], [Validators.required]],
    });
  }

  closeDiaglog() {
    this.dialog.close();
  }

  getAllRoles() {
    this.roleService.getAll().subscribe({
      next: (res) => {
        this.roles = res;
      },
    });
  }
  updateUser() {
    console.log(this.userForm.value);
    this.userService.update(this.data.id, this.userForm.value).subscribe({
      next: (res) => {
        this.dialog.close(true);
      },
    });
  }
}
