import { Component, inject, signal } from '@angular/core';
import { AuthService, ILoginCreds, LoginComponent, SnackbarService } from 'DAL';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  
  private authService = inject(AuthService);
  private snackBarService = inject(SnackbarService);
  private router = inject(Router);
  protected isLoading = false;

  validationErrors = signal<string[]>([]);


  login(data:any){
    this.isLoading = true;
    this.authService.login(data as ILoginCreds).subscribe({
      next:(res)=>{
        this.isLoading = false;
        localStorage.setItem('token',res.token);
        localStorage.setItem('refreshToken',res.refreshToken);
        
        this.authService.getUserInfo().subscribe({
          next:()=>{
            this.snackBarService.success('login successfully');
            this.router.navigateByUrl('/dashboard');
          }
        });
      },
      error:(err)=>{
        this.isLoading = false;
        this.snackBarService.error('login failed');
        this.validationErrors.set(err);
        console.log(err)
      }
    })
  }

}
