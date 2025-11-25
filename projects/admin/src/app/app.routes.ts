import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';
import { AllTimeSlotsComponent } from './modules/timeSlots/all-time-slots/all-time-slots.component';
import { AllPrescriptionComponent } from './modules/prescriptions/all-prescription/all-prescription.component';
import { AddPrescriptionComponent } from './modules/prescriptions/add-prescription/add-prescription.component';
import { UpdatePrescriptionComponent } from './modules/prescriptions/update-prescription/update-prescription.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';
import { AllUsersComponent } from './modules/users/all-users/all-users.component';
import { AllAppointmentsComponent } from './modules/appointments/all-appointments/all-appointments.component';
import { AppointmentCalenderComponent } from './modules/appointments/appointment-calender/appointment-calender.component';
import { AddAppointmentComponent } from './modules/appointments/add-appointment/add-appointment.component';
import { ChatComponent } from './modules/chat/chat.component';
import { UpdateAppointmentComponent } from './modules/appointments/update-appointment/update-appointment.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { authGuard, NotFoundComponent, ServerErrorComponent } from 'DAL';
import { AllPatientsComponent } from './modules/patients/all-patients/all-patients.component';
import { AddPatientComponent } from './modules/patients/add-patient/add-patient.component';
import { UpdatePatientComponent } from './modules/patients/update-patient/update-patient.component';
import { PatientDetailsComponent } from './modules/patients/patient-details/patient-details.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'availability', component: AllTimeSlotsComponent },
      {
        path: 'prescriptions',
        children: [
          { path: '', component: AllPrescriptionComponent },
          { path: 'add', component: AddPrescriptionComponent },
          { path: 'edit/:id', component: UpdatePrescriptionComponent },
        ],
      },
      {
        path: 'appointments',
        children: [
          { path: '', component: AllAppointmentsComponent },
          { path: 'calendar', component: AppointmentCalenderComponent },
          { path: 'add', component: AddAppointmentComponent },
          { path: 'edit/:id', component: UpdateAppointmentComponent },
        ],
      },
      {
        path: 'patients',
        children: [
          { path: '', component: AllPatientsComponent },
          { path: 'add', component: AddPatientComponent },
          { path: 'edit/:id', component: UpdatePatientComponent },
          { path: 'profile/:id', component: PatientDetailsComponent },
        ],
      },
      { path: 'chat', component: ChatComponent },
      { path: 'users', component: AllUsersComponent },
    ],
  },
  {
    path: 'auth',
    children: [{ path: 'login', component: LoginPageComponent }],
  },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent },
];
