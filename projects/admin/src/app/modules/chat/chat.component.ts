import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { AuthService, ChatService, IUser, TimeAgoPipe } from 'DAL';
import moment from 'moment'
import { ChatBoxComponent } from "./chat-box/chat-box.component";
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatIconModule, TimeAgoPipe, ChatBoxComponent],
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
    this.chatService.chatMessages.set([])
    this.chatService.currentOpenedChat.set(user);
    this.chatService.loadMessages(1);
    console.log(this.authService.user()?.id)
  }

}
