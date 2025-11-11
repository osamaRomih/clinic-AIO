import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';
import { HomeComponent } from './modules/home/home.component';
import { AllTimeSlotsComponent } from './modules/timeSlots/all-time-slots/all-time-slots.component';
import { LoginComponent } from './modules/auth/login/login.component';
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

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: ProfileComponent },
          {
            path: 'change-password',
            component: ChangePasswordComponent,
          },
        ],
      },
      { path: 'availability', component: AllTimeSlotsComponent },
      { path: 'prescription', component: AllPrescriptionComponent },
      { path: 'appointments', component: AllAppointmentsComponent },
      {
        path: 'appointment/appointment-calender',
        component: AppointmentCalenderComponent,
      },{
        path:'appointment/bookAppointment',
        component:AddAppointmentComponent
      },
      {path:'chat',component:ChatComponent},
      { path: 'calander', component: CalanderComponent },
      { path: 'users', component: AllUsersComponent },
      {
        path: 'prescriptions/add-prescription',
        component: AddPrescriptionComponent,
      },
      {
        path: 'prescriptions/update/:id',
        component: UpdatePrescriptionComponent,
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
];
