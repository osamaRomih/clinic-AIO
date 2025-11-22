import { Injectable } from '@angular/core';
import { AuthService, IUser } from '../../public-api';
import { lastValueFrom, of } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(private authService:AuthService,private chatService:ChatService){}

  init(){
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if(!userString || !token)
      return of(null);

    const user = JSON.parse(userString);
    this.authService.setCurrentUser(user);
    this.chatService.startConnection(token,user.id);
    
    return of(null)
  }
}
