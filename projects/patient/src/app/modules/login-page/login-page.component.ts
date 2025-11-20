import { Component, inject, signal } from '@angular/core';
import { AuthService, IExternalAuth, ILoginCreds, LoginComponent, SnackbarService } from 'DAL';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private snackBarService = inject(SnackbarService);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);
  protected isLoading = false;

  
  ngOnInit() {
    this.signInWithGoogle();
  }

  validationErrors = signal<string[]>([]);

  login(data: any) {
    this.isLoading = true;
    this.authService.login(data as ILoginCreds).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);

        this.authService.getUserInfo().subscribe({
          next: () => {
            this.snackBarService.success('login successfully');
            this.router.navigateByUrl('/');
          },
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBarService.error('login failed');
        this.validationErrors.set(err);
      },
    });
  }

  signInWithGoogle(){
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
     this.socialAuthService.authState.subscribe( user => {
      const externalAuth: IExternalAuth = {
        provider: user.provider,
        idToken: user.idToken
      }
      this.validateExternalAuth(externalAuth);
    })
  }

  validateExternalAuth(externalAuth: IExternalAuth){
    this.authService.loginWithGoogle(externalAuth).subscribe({
      next: (res:any) => {
        localStorage.setItem('token',res.token);
        localStorage.setItem('refreshToken',res.refreshToken);
        
        this.authService.getUserInfo().subscribe({
          next:()=>{
            this.snackBarService.success('login successfully');
            this.router.navigateByUrl('/');
          }
        });
    },
      error: (err:any) => {
        this.snackBarService.error('Login with Google failed');
        this.validationErrors.set(err);
      }
    });
  }
}
