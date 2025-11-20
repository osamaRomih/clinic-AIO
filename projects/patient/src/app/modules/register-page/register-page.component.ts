import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, ButtonLoadingDirective, FieldErrorDirective, IExternalAuth, SnackbarService } from 'DAL';
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ButtonLoadingDirective,
    GoogleSigninButtonModule,
    RouterLink,
    FieldErrorDirective,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  protected form!: FormGroup;
  protected hidePassword = signal(true);
  protected hideRepeatPassword = signal(true);
  protected isLoading = signal(false);
  protected validationErrors = signal<string[]>([]);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBarService = inject(SnackbarService);
  private router = inject(Router);  
  private socialAuthService = inject(SocialAuthService);
  

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, RegisterPageComponent.passwordValidator]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: [''],
      phoneNumber: ['', [Validators.required, RegisterPageComponent.phoneValidator]],
      userName: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    this.form.controls['password'].valueChanges.subscribe(() => {
      this.form.controls['repeatPassword'].updateValueAndValidity();
    });
  }

  matchValues(matchTo: string) {
    return (control: any) => {
      const parent = control.parent;
      if (!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }

  static passwordValidator(control: AbstractControl) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(control.value) ? null : { passwordPattern: true };
  }

  static phoneValidator(control: AbstractControl) {
    const regex = /^(011|010|012|015)\d{8}$/;
    return regex.test(control.value) ? null : { phonePattern: true };
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

  toggleHidePassword(event: MouseEvent) {
    this.hidePassword.update((hide) => !hide);
    event.preventDefault();
    event.stopPropagation();
  }

  toggleHideRepeatPassword(event: MouseEvent) {
    this.hideRepeatPassword.update((hide) => !hide);
    event.preventDefault();
    event.stopPropagation();
  }
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.authService.register(this.form.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.snackBarService.success('Registration successfully');
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBarService.error('Registration failed');
        this.validationErrors.set(err);
      },
    });
  }
}
