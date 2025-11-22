import { inject, Injectable } from '@angular/core';
import { AuthService, IUser, ThemeService } from '../../public-api';
import { lastValueFrom, of } from 'rxjs';
import { ChatService } from './chat.service';
import {TranslateService} from '@ngx-translate/core'
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService); 

  init(){
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if(!userString || !token)
      return of(null);

    const user = JSON.parse(userString);
    this.authService.setCurrentUser(user);
    this.chatService.startConnection(token,user.id);
    
    this.languageService.initLanguage();
    
    return of(null)
  }
}
