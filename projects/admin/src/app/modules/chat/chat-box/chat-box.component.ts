import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { AuthService, ChatService } from 'DAL';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [MatProgressSpinner,FormsModule],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent implements AfterViewChecked {
  message?:string;
  pageNumber = 1;
  @ViewChild('chatBox') public chatBox?:ElementRef
  constructor(public chatService:ChatService,public authService:AuthService){

  }
  ngAfterViewChecked(): void {
    if(this.chatService.autoScrollEnabled()){
      this.scrollToBottom();
    }
  }

  scrollToBottom(){
    this.chatService.autoScrollEnabled.set(true);
    this.chatBox?.nativeElement.scrollTo({
      top:this.chatBox.nativeElement.scrollHeight,
      behavior:'smooth'
    })
  }

  scrollToTop(){
    this.chatService.autoScrollEnabled.set(false);
    this.chatBox?.nativeElement.scrollTo({
      top:0,
      behavior:'smooth'
    })
  }

  sendMessage(){
    this.chatService.sendMessage(this.message!);
    this.scrollToBottom();
    this.message = '';
  }

  onTyping(){
    this.chatService.typing();
  }

  loadMoreMessages(){
    this.pageNumber++;
    if(this.pageNumber <= this.chatService.totalPages())
      this.chatService.loadMessages(this.pageNumber);
    this.scrollToTop();

  }
}
