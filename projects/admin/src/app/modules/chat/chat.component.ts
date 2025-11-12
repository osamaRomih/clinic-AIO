import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { AuthService, ChatService, IUser, TimeAgoPipe } from 'DAL';
import moment from 'moment'
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatIconModule,TimeAgoPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  constructor(public chatService:ChatService,
    private authService:AuthService
  ){
  }

  ngOnInit(): void {
    this.chatService.startConnection(this.authService.token!,this.authService.user()?.id);
  }


}
