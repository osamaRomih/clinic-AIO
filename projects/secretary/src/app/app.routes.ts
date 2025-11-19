import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { authGuard, authInterceptor } from 'DAL';
import { AllAppointmentsComponent } from './modules/appointments/all-appointments/all-appointments.component';
import { AppointmentCalenderComponent } from './modules/appointments/appointment-calender/appointment-calender.component';
import { AddAppointmentComponent } from './modules/appointments/add-appointment/add-appointment.component';
import { UpdateAppointmentComponent } from './modules/appointments/update-appointment/update-appointment.component';
import { AllPatientsComponent } from './modules/patients/all-patients/all-patients.component';
import { AddPatientComponent } from './modules/patients/add-patient/add-patient.component';
import { UpdatePatientComponent } from './modules/patients/update-patient/update-patient.component';
import { withInterceptors } from '@angular/common/http';

export const routes: Routes =  [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'appointments',
    
        children: [
          { path: '', component: AllAppointmentsComponent },
          { path: 'calendar', component: AppointmentCalenderComponent },
          { path: 'add', component: AddAppointmentComponent },
          { path: 'edit/:id', component: UpdateAppointmentComponent }
        ]
      },
      {
        path: 'patients',
        children: [
          { path: '', component: AllPatientsComponent },
          { path: 'add', component: AddPatientComponent },
          { path: 'edit/:id', component: UpdatePatientComponent }
        ]
      },

  //     // Chat
  //     { path: 'chat', component: ChatComponent },

  //     // Calendar
  //     { path: 'calendar', component: CalanderComponent },

  //     // Users
  //     { path: 'users', component: AllUsersComponent },
    ],
  },

  // Auth
  {
    path: 'auth',

    children: [
      { path: 'login', component: LoginPageComponent },
    ]
  },

  { path: '**', redirectTo: 'home' }
];
