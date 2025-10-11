import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if(!req.url.includes('/auth')){
    const newRequest = req.clone({
        headers: req.headers.append(
          'Authorization',
          `Bearer ${localStorage.getItem('token')}`
        ),
    });
    return next(newRequest);
  }
  
  return next(req);
};
