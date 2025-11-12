import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { ChatService, IChatUser, TimeAgoPipe } from 'DAL';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [MatIconModule, TimeAgoPipe],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss'
})
export class ChatSidebarComponent {

  constructor(public chatService:ChatService,
    ){
    }
  openChatWindow(user:IChatUser){
    this.chatService.chatMessages.set([]);
    this.chatService.totalPages.set(1);
    this.chatService.currentOpenedChat.set(user);
    this.chatService.loadMessages(1);
    this.chatService.autoScrollEnabled.set(true);
  }

  onSearch(event:any){
    console.log(event.target.value)
    this.chatService.search(event.target.value)
  }
}
