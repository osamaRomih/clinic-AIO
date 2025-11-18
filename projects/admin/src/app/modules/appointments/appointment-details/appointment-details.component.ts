import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, IAppointment, TimeShortPipe } from 'DAL';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [MatCardModule,MatDividerModule,MatButtonModule,DatePipe,TimeShortPipe,MatIconModule],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss'
})
export class AppointmentDetailsComponent {
  protected appointment:IAppointment = inject(MAT_DIALOG_DATA);
  private dialog = inject(MatDialogRef<AppointmentDetailsComponent>);

  closeDialog() {
    this.dialog.close();
  }
}
