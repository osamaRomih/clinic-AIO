import { Component } from '@angular/core';
import { MatProgressSpinner, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { AuthService, ChatService } from 'DAL';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [MatProgressSpinner],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent {

  constructor(public chatService:ChatService,public authService:AuthService){

  }

  sendMessage(content:string){
    this.chatService.sendMessage(content)
  }
}
