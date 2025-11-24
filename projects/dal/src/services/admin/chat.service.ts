import { computed, inject, Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { IMessage } from '../../models/message';
import { IChatUser } from '../../models/user';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private hubUrl = 'http://localhost:5069/hubs/chat';
  userId?: string;
  currentOpenedChat = signal<IChatUser | null>(null);
  chatMessages = signal<IMessage[]>([]);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);
  autoScrollEnabled = signal<boolean>(true);
  searchTerm = signal<string>('');

  allUsers = signal<IChatUser[]>([]);
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allUsers().filter((user) => {
      return user.fullName.includes(term.trim());
    });
  });

  private snackBarService = inject(SnackbarService);

  private typingTimeouts: { [id: string]: any } = {};
  private hubConnection?: HubConnection;

  startConnection(token: string, senderId?: string) {
    this.userId = senderId;
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?SenderId=${senderId || ''}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      })
      .catch((err) => {
        console.log('Connection error', err);
      });

    this.hubConnection.on('OnlineUsers', (users: IChatUser[]) => {
      this.applyUsers(users);
    });

    this.hubConnection.on('UserBecameOnline', (user: IChatUser) => {
      this.updateUserStatus(user.id, true);
    });

    this.hubConnection.on('OnlineUsersUpdated', (users: IChatUser[]) => {
      this.applyUsers(users);
    });

    this.hubConnection.on('UserWentOffline', (user: IChatUser) => {
      this.updateUserStatus(user.id, false, user.lastSeen);
    });

    this.hubConnection.on('ReceiveMessageList', (messages: IMessage[], totalPages: number) => {
      this.totalPages.set(totalPages);
      this.isLoading.set(true);
      this.receiveMessages(messages);
      this.isLoading.set(false);
    });

    this.hubConnection.on('ReceiveNewMessage', (message: IMessage) => {
      this.receiveNewMessage(message);
    });

    this.hubConnection.on('NotifyOnlineUser', (user: IChatUser) => {
      this.displayNotification(user);
    });

    this.hubConnection.on('NotifyTypingToUser', (id: string) => {
      this.notifyTypingToUser(id);
    });

    this.hubConnection.on('DeletedMessage', (message: IMessage) => {
      this.deleteMessageFromChatMessages(message);
    });

    this.hubConnection.on('UpdatedMessage', (message: IMessage) => {
      this.updateMessageInChatMessages(message);
    });
  }

  applyUsers(users: IChatUser[]) {
    const filteredUsers = users.filter((user) => user.id != this.userId);

    this.allUsers.set(filteredUsers);
  }

  updateUserStatus(id: string, status: boolean, lastSeen?: string) {
    this.allUsers.update((users) => users.map((user) => (user.id == id ? { ...user, isOnline: status, lastSeen: lastSeen ?? '' } : user)));
  }

  loadMessages(pageNumber: number) {
    this.isLoading.set(true);
    this.hubConnection
      ?.invoke('LoadMessages', this.currentOpenedChat()?.id, pageNumber)
      .then()
      .catch()
      .finally(() => {});
  }

  displayNotification(user: IChatUser) {
    Notification.requestPermission().then((result) => {
      console.log(result);
      if (result == 'granted') {
        new Notification('Active Now', {
          body: user.fullName + 'is online now',
          icon: 'http://localhost:5069' + user.imageUrl,
        });
      }
    });
  }

  receiveMessages(messages: IMessage[]) {
    console.log(messages);
    this.chatMessages.update((curr) => [...messages, ...curr]);
    this.isLoading.update(() => false);
  }

  receiveNewMessage(message: IMessage) {
    const exists = this.chatMessages().some((m) => m.id === message.id);

    if (this.currentOpenedChat()?.id == message.senderId || message.senderId == this.userId) {
      if (!exists) {
        this.chatMessages.update((curr) => [...curr, message]);
        console.log(this.chatMessages());
      }
    }

    if (message.receiverId == this.userId) {
      const sender = this.allUsers().find((u) => u.id == message.senderId);
      let audio = new Audio('assets/audios/notification.mp3');
      audio.play();
      this.snackBarService.success('Message recevied successfully from ' + sender?.fullName);
    }
  }

  deleteMessage(message: IMessage) {
    this.hubConnection?.invoke('DeleteMessage', message.id).then().catch();
  }

  deleteMessageFromChatMessages(message: IMessage) {
    this.chatMessages.update((messages) => messages.filter((msg) => msg.id != message.id));

    if (message?.senderId == this.userId) this.snackBarService.success('Message deleted successfully');
    else if (message?.receiverId == this.userId) {
      const userMessage = this.allUsers().find((u) => u.id == message?.senderId);
      this.snackBarService.success(userMessage?.fullName + ' delete message');
    }
  }

  updateMessageInChatMessages(message: IMessage) {
    console.log(message)
    this.chatMessages.update((messages) => messages
    .map((msg) => msg.id === message.id ? { ...msg, content: message.content } : msg));

    if (message.senderId == this.userId) {
      this.snackBarService.success('Message updated successfully');
    }
  }

  updateMessage(message: IMessage) {
    const updatedMessage = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
    };
    this.hubConnection?.invoke('UpdateMessage',updatedMessage).then().catch();
  }

  notifyTypingToUser(id: string) {
    this.allUsers.update((users) =>
      users.map((user) => {
        if (user.id == id) {
          user.isTyping = true;
        }
        return user;
      }),
    );

    if (this.typingTimeouts[id]) clearTimeout(this.typingTimeouts[id]);

    this.typingTimeouts[id] = setTimeout(() => {
      this.allUsers.update((users) =>
        users.map((user) => {
          if (user.id == id) {
            user.isTyping = false;
          }
          return user;
        }),
      );
      delete this.typingTimeouts[id];
    }, 2000);
  }

  sendMessage(content: string) {
    //TODO: don't add message with id = 0 because when delete message
    this.hubConnection
      ?.invoke('SendMessage', {
        receiverId: this.currentOpenedChat()?.id,
        content: content,
      })
      .then()
      .catch()
      .finally(() => {});
  }

  typing() {
    this.hubConnection
      ?.invoke('NotifyTyping', this.currentOpenedChat()?.id)
      .then()
      .catch()
      .finally(() => {});
  }

  async closeConnection() {
    if (!this.hubConnection) return;

    try {
      await this.hubConnection.stop();
      console.log('SignalR stopped');
    } catch (err) {
      console.error('Error stopping SignalR:', err);
    } finally {
      this.hubConnection = undefined;
    }
  }
}
