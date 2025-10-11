import { Injectable } from '@angular/core';
import { AuthService } from '../../public-api';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(private authService:AuthService){}

  init():Promise<void>{
    const token = localStorage.getItem('token');

    if(!token)
      return Promise.resolve();
    return lastValueFrom(this.authService.getUserInfo()).then({
      next:()=>{},
      error:()=>{}
    } as any);
  }
}
