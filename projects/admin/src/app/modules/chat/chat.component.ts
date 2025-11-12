import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { AuthService, ChatService, IChatUser, IUser, TimeAgoPipe } from 'DAL';
import moment from 'moment'
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { ChatSidebarComponent } from "./chat-sidebar/chat-sidebar.component";
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatIconModule, ChatBoxComponent, ChatSidebarComponent],
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


}
