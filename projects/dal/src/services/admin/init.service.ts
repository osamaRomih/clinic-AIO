import { Injectable } from '@angular/core';
import { AuthService, IUser } from '../../public-api';
import { lastValueFrom } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(private authService:AuthService,private chatService:ChatService){}

  init():Promise<void>{
    const token = localStorage.getItem('token');

    if(!token)
      return Promise.resolve();

    return lastValueFrom(this.authService.getUserInfo()).then({
      next:(user:IUser)=>{
        if(user.id)
          this.chatService.startConnection(token,user.id);
      },
      error:()=>{}
    } as any);
  }
}
