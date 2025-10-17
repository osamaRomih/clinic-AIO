import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { IUserResponse, UserService } from 'DAL';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss',
})
export class AllUsersComponent {
  constructor(
    private router: Router,
    private service: UserService,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'name',
    'userName',
    'phoneNumber',
    'email',
    'roles',
    'isDisabled',
    'isLocked',
    'actions'
  ];
  dataSource = new MatTableDataSource<IUserResponse>();

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.service.getAll().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width:'750px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.getAllUsers();
      }
    });
  }

  updateUser(id: number) {
    this.router.navigate(['/Users/update', id]);
  }

  deleteUser(id: number) {
    // this.service.delete(id).subscribe({
    //   next: (res) => {
    //     this.getAllPrescription();
    //   },
    // });
  }
  openDialogDetails(id: number) {
    // this.service.getById(id).subscribe({
    //   next: (res) => {
    //     const dialogRef = this.dialog.open(DetailsPrescriptionComponent, {
    //       data: res,
    //       width:'750px'
    //     });

    //     dialogRef.afterClosed().subscribe((result) => {});
    //   },
    // });
  }
}
