import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';
import { HomeComponent } from './modules/home/home.component';
import { AllTimeSlotsComponent } from './modules/timeSlots/all-time-slots/all-time-slots.component';
import { authGuard } from './guards/auth.guard';
import { AllPrescriptionComponent } from './modules/prescriptions/all-prescription/all-prescription.component';
import { AddPrescriptionComponent } from './modules/prescriptions/add-prescription/add-prescription.component';
import { UpdatePrescriptionComponent } from './modules/prescriptions/update-prescription/update-prescription.component';
import { ProfileComponent } from './modules/settings/profile/profile.component';
import { ChangePasswordComponent } from './modules/settings/change-password/change-password.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { AllUsersComponent } from './modules/users/all-users/all-users.component';
import { AllAppointmentsComponent } from './modules/appointments/all-appointments/all-appointments.component';
import { CalanderComponent } from './modules/calander/calander.component';
import { AppointmentCalenderComponent } from './modules/appointments/appointment-calender/appointment-calender.component';
import { AddAppointmentComponent } from './modules/appointments/add-appointment/add-appointment.component';
import { ChatComponent } from './modules/chat/chat.component';
import { UpdateAppointmentComponent } from './modules/appointments/update-appointment/update-appointment.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginPageComponent } from './modules/login-page/login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // Home / Dashboard
      { path: 'home', component: HomeComponent,},
      { path: 'dashboard', component: DashboardComponent },

      // Settings
      {
        path: 'settings',
        component: SettingsComponent,
    
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: ProfileComponent },
          { path: 'change-password', component: ChangePasswordComponent}
        ]
      },

      // Availability
      { path: 'availability', component: AllTimeSlotsComponent },

      // Prescriptions
      {
        path: 'prescriptions',
    
        children: [
          { path: '', component: AllPrescriptionComponent},
          { path: 'add', component: AddPrescriptionComponent },
          { path: 'edit/:id', component: UpdatePrescriptionComponent }
        ]
      },

      // Appointments
      {
        path: 'appointments',
    
        children: [
          { path: '', component: AllAppointmentsComponent },
          { path: 'calendar', component: AppointmentCalenderComponent },
          { path: 'add', component: AddAppointmentComponent },
          { path: 'edit/:id', component: UpdateAppointmentComponent }
        ]
      },

      // Chat
      { path: 'chat', component: ChatComponent },

      // Calendar
      { path: 'calendar', component: CalanderComponent },

      // Users
      { path: 'users', component: AllUsersComponent },
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
