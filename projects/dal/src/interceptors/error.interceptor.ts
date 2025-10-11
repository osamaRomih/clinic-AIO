import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../public-api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);
  const router = inject(Router);

  let ctr = 0;
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        if (error.status === 400 && error.error?.errors) {
          const validationErrors = error.error.errors;

          for (const key in validationErrors) {
            if (validationErrors[key]) {
              validationErrors[key].forEach((msg: string) => {
                toastr.error(msg, 'Validation Error');
              });
            }
          }
        }
        // Unauthorized
        else if (error.status === 401 && ctr != 1) {
          ctr++;

          return authService.refreshToken().pipe(
            switchMap((res: any) => {
              toastr.success('Token refreshed');

              // Retry original request with new access token
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.token}` },
              });

              // reset counter
              ctr = 0;
              return next(newReq);
            }),
            catchError((err) => {
              authService.revokeRefreshToken().subscribe(() => {
                router.navigateByUrl('/auth/login');
              });
              return throwError(() => err);
            })
          );
        }

        // Forbidden
        else if (error.status === 403) {
          toastr.error('You do not have permission to perform this action.', 'Forbidden');
        }
        // Not Found
        else if (error.status === 404) {
          toastr.error('Resource not found', 'Error');
        }
        // Internal Server Error
        else if (error.status === 500) {
          toastr.error('Something went wrong on the server.', 'Server Error');
        }
        // Default case
        else {
          toastr.error(error.message || 'An unexpected error occurred.', 'Error');
        }
      }

      return throwError(() => error);
    })
  );
};
