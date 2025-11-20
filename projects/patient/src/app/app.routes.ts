import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { NotFoundComponent, ServerErrorComponent } from 'DAL';
import { RegisterPageComponent } from './modules/register-page/register-page.component';
import { LoginGoogleComponent } from './modules/login-google/login-google.component';

export const routes: Routes = [
  {
      path: 'auth',
  
      children: [
        { path: 'login', component: LoginPageComponent },
        { path: 'login-google', component: LoginGoogleComponent },
        { path: 'register',component : RegisterPageComponent}
      ]
    },
    { path: 'server-error', component: ServerErrorComponent },
    { path: '**', component:NotFoundComponent }
];
