import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';
import { HomeComponent } from './modules/home/home.component';
import { AllTimeSlotsComponent } from './modules/timeSlots/all-time-slots/all-time-slots.component';
import { LoginPageComponent } from './modules/auth/login/login-page.component';
import { RegisterComponent } from './modules/auth/register/register.component';
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

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // Home / Dashboard
      { path: 'home', component: HomeComponent, title: 'Home' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },

      // Settings
      {
        path: 'settings',
        component: SettingsComponent,
        title: 'Settings',
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: ProfileComponent, title: 'Profile' },
          { path: 'change-password', component: ChangePasswordComponent, title: 'Change Password' }
        ]
      },

      // Availability
      { path: 'availability', component: AllTimeSlotsComponent, title: 'Availability' },

      // Prescriptions
      {
        path: 'prescriptions',
        title: 'Prescriptions',
        children: [
          { path: '', component: AllPrescriptionComponent, title: 'All Prescriptions' },
          { path: 'add', component: AddPrescriptionComponent, title: 'Add Prescription' },
          { path: 'edit/:id', component: UpdatePrescriptionComponent, title: 'Edit Prescription' }
        ]
      },

      // Appointments
      {
        path: 'appointments',
        title: 'Appointments',
        children: [
          { path: '', component: AllAppointmentsComponent, title: 'All Appointments' },
          { path: 'calendar', component: AppointmentCalenderComponent, title: 'Appointment Calendar' },
          { path: 'add', component: AddAppointmentComponent, title: 'Add Appointment' },
          { path: 'edit/:id', component: UpdateAppointmentComponent, title: 'Edit Appointment' }
        ]
      },

      // Chat
      { path: 'chat', component: ChatComponent, title: 'Chat' },

      // Calendar
      { path: 'calendar', component: CalanderComponent, title: 'Calendar' },

      // Users
      { path: 'users', component: AllUsersComponent, title: 'Users' },
    ],
  },

  // Auth
  {
    path: 'auth',
    title: 'Auth',
    children: [
      { path: 'login', component: LoginPageComponent, title: 'Login' },
      { path: 'register', component: RegisterComponent, title: 'Register' }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
