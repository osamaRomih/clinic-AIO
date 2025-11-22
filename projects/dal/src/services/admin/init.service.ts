import { inject, Injectable } from '@angular/core';
import { AuthService, IUser, ThemeService } from '../../public-api';
import { lastValueFrom, of } from 'rxjs';
import { ChatService } from './chat.service';
import {TranslateService} from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private translate = inject(TranslateService);
  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  private themeService = inject(ThemeService);

  init(){
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if(!userString || !token)
      return of(null);

    const user = JSON.parse(userString);
    this.authService.setCurrentUser(user);
    this.chatService.startConnection(token,user.id);
    this.translate.use(localStorage.getItem('lang') || 'ar');
    document.documentElement.setAttribute('dir',localStorage.getItem('lang')=='ar'?'rtl':'ltr');
    
    return of(null)
  }
}
