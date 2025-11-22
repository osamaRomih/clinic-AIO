import { Component, inject, signal } from '@angular/core';
import { AuthService, ButtonLoadingDirective, ILoginCreds, SnackbarService } from 'DAL';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, ButtonLoadingDirective],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private snackBarService = inject(SnackbarService);
  private router = inject(Router);
  protected isLoading = false;
  hide = signal(true);

  validationErrors = signal<string[]>([]);

  private fb = inject(FormBuilder);
  protected form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      emailOrUsername: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.isLoading = true;

    this.authService.login(this.form.value as ILoginCreds).subscribe({
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

  toggleHide(event: MouseEvent) {
    this.hide.update((hide) => !hide);
    event.preventDefault();
    event.stopPropagation();
  }
}
