import { Component, inject } from '@angular/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ChatService, IChatUser, TimeAgoPipe } from 'DAL';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [MatIconModule, TimeAgoPipe,MatLabel,MatFormFieldModule,MatInputModule,TranslatePipe],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss'
})
export class ChatSidebarComponent {

  chatService = inject(ChatService);

  openChatWindow(user:IChatUser){
    console.log(user)
    this.chatService.chatMessages.set([]);
    this.chatService.totalPages.set(1);
    this.chatService.currentOpenedChat.set(user);
    // this.chatService.markMessagesAsRead(user.id);
    this.chatService.loadMessages(1);
    this.chatService.autoScrollEnabled.set(true);
  }

  onSearch(event:any){
    console.log(event)
    this.chatService.searchTerm.set(event.target.value)
  }
}
