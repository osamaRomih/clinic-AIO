import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { IUser, IUserRead, SnackbarService, UserService } from 'DAL';
import { AddUserComponent } from '../add-user/add-user.component';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatIconModule, MatMenuModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss',
})
export class AllUsersComponent {
  constructor(
    private router: Router,
    private service: UserService,
    private dialog: MatDialog,
    private snackbar:SnackbarService
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
  dataSource = new MatTableDataSource<IUserRead>();

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
        this.snackbar.success('user created successfully');
        this.getAllUsers();
      }
    });
  }

  updateUser(user:IUserRead) {
    const dialogRef = this.dialog.open(UpdateUserComponent,{
      width:'750px',
      data:user
    })

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.snackbar.success('user updated successfully');
        this.getAllUsers();
      }
    });
  }

  toggleStatus(id: string) {
    this.service.toggleStatus(id).subscribe({
      next: (res) => {
        const user = this.dataSource.data.find(u=>u.id==id);
        if(user){
          user.isDisabled = !user.isDisabled;
          this.snackbar.success('user updated successfully');
          this.dataSource._updateChangeSubscription();
        }
      },
    });
  }

  unlockUser(myUser:IUserRead){
    if(!myUser.isLocked){
      //TODO : show toastr for the user is not locked
      return;
    }
    this.service.unlock(myUser.id).subscribe({
      next:(res)=>{
        const user = this.dataSource.data.find(u=>u.id==myUser.id);
        if(user){
          user.isLocked = false;
          this.snackbar.success('user updated successfully');
          this.dataSource._updateChangeSubscription();
        }
      }
    })
  }
}
