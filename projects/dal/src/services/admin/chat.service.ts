import { inject, Injectable, signal } from '@angular/core';
import { AuthService, IUser } from '../../public-api';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { IMessage } from '../../models/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private hubUrl = 'https://localhost:7096/hubs/chat';
  allUsers = signal<IUser[]>([]);
  userId?: string;
  currentOpenedChat = signal<IUser | null>({} as IUser);
  chatMessages = signal<IMessage[]>([]);
  isLoading = signal<boolean>(false);

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

    this.hubConnection.on('OnlineUsers', (users: IUser[]) => {
      this.applyUsers(users);
    });

    this.hubConnection.on('UserBecameOnline', (user: IUser) => {
      this.updateUserStatus(user.id, true);
    });

    this.hubConnection.on('OnlineUsersUpdated', (users: IUser[]) => {
      this.applyUsers(users);
    });

    this.hubConnection.on('UserWentOffline', (user: IUser) => {
      this.updateUserStatus(user.id, false, user.lastSeen);
    });

    this.hubConnection.on('ReceiveMessageList', (messages: IMessage[]) => {
      this.receiveMessages(messages);
    });

    this.hubConnection.on('ReceiveNewMessage', (message: IMessage) => {
      this.receiveNewMessage(message);
    });

    this.hubConnection.on('NotifyOnlineUser',(user:IUser)=>{
      this.displayNotification(user);
    })
  }

  applyUsers(users: IUser[]) {
    const filteredUsers = users.filter((user) => user.id != this.userId);

    this.allUsers.set(filteredUsers);
  }

  updateUserStatus(id: string, status: boolean, lastSeen?: string) {
    this.allUsers.update((users) =>
      users.map((user) =>
        user.id == id
          ? { ...user, isOnline: status, lastSeen: lastSeen ?? '' }
          : user
      )
    );
  }

  loadMessages(pageNumber: number) {
    this.hubConnection
      ?.invoke('LoadMessages', this.currentOpenedChat()?.id, pageNumber)
      .then()
      .catch()
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  displayNotification(user:IUser){
    Notification.requestPermission().then((result)=>{
      console.log(result)
      if(result=="granted"){

        new Notification('Active Now',{
          body:user.firstName + ' ' + user.lastName + "is online now",
          icon:'https://localhost:7096'+user.imageUrl
        })
      }
    })
  }

  receiveMessages(messages: IMessage[]) {
    this.chatMessages.update((curr) => [...messages, ...curr]);
    this.isLoading.update(() => false);
    console.log('Receive all messages' + messages);
  }

  receiveNewMessage(message: IMessage) {
    console.log(message);
    this.chatMessages.update((curr) => [...curr, message]);
    console.log('Receive one new message', message);
  }

  sendMessage(content: string) {
    this.chatMessages.update((curr) => [
      ...curr,
      {
        id: 0,
        content: content,
        createdDate: new Date().toString(),
        isRead: false,
        receiverId: this.currentOpenedChat()?.id!,
        senderId: this.userId!,
      },
    ]);

    this.hubConnection
      ?.invoke('SendMessage', {
        receiverId: this.currentOpenedChat()?.id,
        content: content,
      })
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
