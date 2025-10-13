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
import { ProfileComponent } from './modules/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'availability', component: AllTimeSlotsComponent },
      { path: 'prescription', component: AllPrescriptionComponent },
      { path: 'prescriptions/add-prescription', component: AddPrescriptionComponent },
      { path: 'prescriptions/update/:id', component: UpdatePrescriptionComponent },
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
