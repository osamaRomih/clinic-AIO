import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../public-api';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn =  (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.user()){
    return true;
  }else{
    router.navigate(['/auth/login'],{queryParams:{returnUrl:state.url}});
    return false;
  }
};
