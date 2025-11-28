import { Location } from '@angular/common';
import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppointmentService, DatePipe, DialogService, IAppointmentDetails, SnackbarService, TimeShortPipe } from 'DAL';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule, MatIconModule, TranslatePipe, TimeShortPipe, DatePipe],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss',
})
export class AppointmentDetailsComponent implements OnInit {
  // protected appointment: IAppointment = inject(MAT_DIALOG_DATA);
  // private dialog = inject(MatDialogRef<AppointmentDetailsComponent>);

  protected appointment!: IAppointmentDetails;
  private appointmentService = inject(AppointmentService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private confirmationDiaglog = inject(DialogService);
  private snackBarService = inject(SnackbarService);

  private appointmentId!: number;

  ngOnInit(): void {
    this.appointmentId = this.activeRoute.snapshot.params['id'];
    this.loadAppointmentDetails();
  }

  private loadAppointmentDetails() {
    this.appointmentService.getById(this.appointmentId).subscribe({
      next: (res) => {
        this.appointment = res;
      },
    });
  }

  // --- Action Handlers ---
  goBack() {
    this.location.back();
  }

  viewPatientProfile() {
    // console.log(`Viewing profile for patient: ${this.appointment().patient.id}`);
    this.router.navigate(['/patients/profile', this.appointment.patient.id]);
  }

  cancelAppointment() {
    this.confirmationDiaglog.confirmDialog('Cancel Appointment', 'Are you sure you want to cancel this appointment?').subscribe({
      next: (res) => {
        if (res) {
          this.appointmentService.cancel(this.appointmentId).subscribe({
            next: () => {
              this.snackBarService.success('Appointment cancelled successfully');
              this.router.navigate(['/appointments']);
            },
          });
        }
      },
    });
  }

  rescheduleAppointment() {
    // console.log(`Action: Reschedule Appointment ${this.appointment().id}`);
  }

  completeVisit() {
    this.confirmationDiaglog.confirmDialog('Complete Appointment', 'Are you sure you want to complete this appointment?').subscribe({
      next: (res) => {
        if (res) {
          this.appointmentService.complete(this.appointmentId).subscribe({
            next: () => {
              this.snackBarService.success('Appointment completed successfully');
              this.router.navigate(['/appointments']);
            },
          });
        }
      },
    });
  }
}
