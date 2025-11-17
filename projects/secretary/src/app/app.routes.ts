import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { authGuard } from 'DAL';

export const routes: Routes =  [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // Home / Dashboard
      { path: 'dashboard', component: DashboardComponent },

      // Settings
      // {
      //   path: 'settings',
      //   component: SettingsComponent,
    
      //   children: [
      //     { path: '', redirectTo: 'profile', pathMatch: 'full' },
      //     { path: 'profile', component: ProfileComponent },
      //     { path: 'change-password', component: ChangePasswordComponent}
      //   ]
      // },

      // Availability
  //     { path: 'availability', component: AllTimeSlotsComponent },

  //     // Prescriptions
  //     {
  //       path: 'prescriptions',
    
  //       children: [
  //         { path: '', component: AllPrescriptionComponent},
  //         { path: 'add', component: AddPrescriptionComponent },
  //         { path: 'edit/:id', component: UpdatePrescriptionComponent }
  //       ]
  //     },

  //     // Appointments
  //     {
  //       path: 'appointments',
    
  //       children: [
  //         { path: '', component: AllAppointmentsComponent },
  //         { path: 'calendar', component: AppointmentCalenderComponent },
  //         { path: 'add', component: AddAppointmentComponent },
  //         { path: 'edit/:id', component: UpdateAppointmentComponent }
  //       ]
  //     },

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
