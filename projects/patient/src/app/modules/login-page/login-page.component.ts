import { Component, inject, signal } from '@angular/core';
import { AuthService, IExternalAuth, ILoginCreds, LoginComponent, SnackbarService } from 'DAL';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

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
            this.router.navigateByUrl('/dashboard');
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
    this.socialAuthService.signIn('GOOGLE');
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
        console.log(res)
        alert('Login with Google successful');
          // localStorage.setItem("token", res.token);
          // this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
          // this.router.navigate([this.returnUrl]);
    },
      error: (err:any) => {
        alert('Login with Google failed');
        console.log(err);
        // this.errorMessage = err.message;
        // this.showError = true;
        // this.authService.signOutExternal();
      }
    });
  }
}
