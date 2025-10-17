import { Component, Inject, inject, OnInit } from '@angular/core';
// import {MatTimepickerModule} from '@angular/material/timepicker';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
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
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { IRoleResponse, ITimeSlot, RoleService, TimeslotService, UserService } from 'DAL';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { JsonPipe } from '@angular/common';
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

    this.roleService.getAll().subscribe({
      next: (res) => {
        this.roles = res;
      },
    });
  }

  createForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      roles: [[], [Validators.required]],
    });
  }

  closeDiaglog() {}
  addUser() {
    console.log(this.userForm.value)
    this.userService.add(this.userForm.value).subscribe({
      next: (res) => {
        this.dialog.close(true);
      },
    });
  }
}
