import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService, SnackbarService } from '../public-api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);
  const authService = inject(AuthService);
  const router = inject(Router);

  let ctr = 0;
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        snackbarService.error('Network error: unable to reach server');
        return throwError(() => error);
      }

      switch (error.status) {
        case 400: {
          const validationErrors = error.error?.errors;

          if (validationErrors) {
            let modelStateErrors:string[] = [];

            for (const key in validationErrors) {
              if (validationErrors[key]) {
                validationErrors[key].forEach((msg: string) => {
                  modelStateErrors.push(msg);
                  snackbarService.error(msg || 'Validation Error');
                });
              }
            }

            throw modelStateErrors;
          } else {
            const msg = error.error?.title || error.error?.message || 'Bad Request';
            snackbarService.error(msg);
          }

          break;
        }
        case 401:
          snackbarService.error('Unauthorized');
          break;
        case 404:
          router.navigateByUrl('/not-found');
          break;
        case 500: {
          const navigationExtras = { state: { error: error.error } };
          router.navigateByUrl('/server-error', navigationExtras);
          break;
        }
        default:
          snackbarService.error('Unexpected error');
      }


      return throwError(() => error);
    }),
  );
};
