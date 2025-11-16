import { Component, inject } from '@angular/core';
import { AuthService, ILoginCreds, SnackbarService } from 'DAL';
import { LoginComponent } from "../../../../../../dal/src/public-api";
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  
  private authService = inject(AuthService);
  private snackBarService = inject(SnackbarService);
  private router = inject(Router);


  login(data:ILoginCreds){
    this.authService.login(data).subscribe({
      next:(res)=>{

        localStorage.setItem('token',res.token);
        localStorage.setItem('refreshToken',res.refreshToken);

        this.authService.getUserInfo().subscribe();
        this.snackBarService.success('login successfully');
        this.router.navigate(['/']);
      }
    })
  }

}
