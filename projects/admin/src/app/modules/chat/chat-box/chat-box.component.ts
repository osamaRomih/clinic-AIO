import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { AuthService, ChatService, DatePipe, DialogService, IMessage, LanguageService, TimeShortPipe } from 'DAL';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [
    MatProgressSpinner,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIcon,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
    DatePipe,
  ],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
})
export class ChatBoxComponent implements AfterViewChecked {
  message: IMessage | null = null;
  messageContent?: string;
  pageNumber = 1;
  @ViewChild('chatBox') public chatBox?: ElementRef;

  protected chatService = inject(ChatService);
  protected authService = inject(AuthService);
  protected translateService = inject(TranslateService);
  private confirmDialog = inject(DialogService);

  ngAfterViewChecked(): void {
    if (this.chatService.autoScrollEnabled()) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    this.chatService.autoScrollEnabled.set(true);
    this.chatBox?.nativeElement.scrollTo({
      top: this.chatBox.nativeElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  scrollToTop() {
    this.chatService.autoScrollEnabled.set(false);
    this.chatBox?.nativeElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  sendMessage() {
    if (!this.messageContent || this.messageContent?.trim() === '') return;
    if (this.message && this.message.id) {
      this.chatService.updateMessage({ ...this.message, content: this.messageContent! });
      this.message = null;
    } else this.chatService.sendMessage(this.messageContent!);

    this.scrollToBottom();
    this.messageContent = '';
  }

  onTyping() {
    this.chatService.typing();
  }

  loadMoreMessages() {
    this.pageNumber++;
    if (this.pageNumber <= this.chatService.totalPages()) this.chatService.loadMessages(this.pageNumber);
    this.scrollToTop();
  }

  deleteMessage(item: IMessage) {
    console.log('first');
    this.confirmDialog.confirmDialog('Delete message', 'Are you sure that you want to delete this message?').subscribe({
      next: (result) => {
        if (result) this.chatService.deleteMessage(item);
      },
    });
  }

  updateMessage(item: IMessage) {
    this.messageContent = item.content;
    this.message = item;
  }
}
