import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { NotFoundComponent, ServerErrorComponent } from 'DAL';
import { RegisterPageComponent } from './modules/register-page/register-page.component';
import { HomeComponent } from './modules/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth',

    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
    ],
  },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent },
];
