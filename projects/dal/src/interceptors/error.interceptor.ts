import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/admin/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(SnackbarService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Network / CORS / no response
      if (err.status === 0) {
        toast.error('Network error: unable to reach server');
        return throwError(() => err);
      }

      const serverMessage = err.error?.message || err.error?.title || err.error?.detail || null;

      switch (err.status) {
        case 400: {
          const validationErrors = err.error?.errors;
          if (validationErrors && typeof validationErrors === 'object') {
            const errors = getErrors(validationErrors);
            errors.forEach(err => toast.error(err));
            return throwError(() => errors);
          } else {
            toast.error(serverMessage ?? 'Bad Request');
            return throwError(() => err);
          }
        }

        case 401: {
          const maybeErrors = err.error?.errors;
          if (maybeErrors && typeof maybeErrors === 'object') {
            return throwError(() => getErrors(maybeErrors));
          }

          router.navigateByUrl('/auth/login');
          return throwError(() => err);
        }

        case 404: {
          router.navigateByUrl('/not-found');
          return throwError(() => err);
        }

        case 500: {
          const navigationExtras = { state: { error: err.error } };
          router.navigateByUrl('/server-error', navigationExtras);
          return throwError(() => err);
        }

        default: {
          toast.error(serverMessage ?? 'Unexpected error');
          return throwError(() => err);
        }
      }
    }),
  );
};

const getErrors = (errors: any): string[] => {
  const modelStateErrors: string[] = [];
  for (const key in errors)
    if (errors[key]) {
      modelStateErrors.push(...errors[key]);
    }
  return modelStateErrors;
};
