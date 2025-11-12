import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { AuthService, ChatService, IUser, TimeAgoPipe } from 'DAL';
import {MatProgressSpinner} from '@angular/material/progress-spinner'
import moment from 'moment'
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatIconModule,TimeAgoPipe,MatProgressSpinner],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  constructor(public chatService:ChatService,
    public authService:AuthService
  ){
  }

  ngOnInit(): void {
    this.chatService.startConnection(this.authService.token!,this.authService.user()?.id);
  }

  openChatWindow(user:IUser){
    this.chatService.currentOpenedChat.set(user);
    this.chatService.loadMessages(1);
    console.log(this.authService.user()?.id)
  }

}
