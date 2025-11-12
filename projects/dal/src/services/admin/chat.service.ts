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
  userId?:string;
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
      this.updateUserStatus(user.id, false,user.lastSeen);
    });

    this.hubConnection.on('ReceiveMessageList',(messages:IMessage[])=>{
      this.receiveMessages(messages);
    })
  }

  applyUsers(users: IUser[]) {
    const filteredUsers = users.filter(
      (user) => user.id != this.userId
    );

    this.allUsers.set(filteredUsers);
  }

  updateUserStatus(id: string, status: boolean,lastSeen?:string) {
    this.allUsers.update((users) =>
      users.map((user) =>
        user.id == id ? { ...user, isOnline: status,lastSeen:lastSeen ?? '' } : user
      )
    );
  }

  loadMessages(pageNumber:number){
    this.hubConnection?.invoke('LoadMessages',this.currentOpenedChat()?.id,pageNumber)
    .then()
    .catch()
    .finally(()=>{
      this.isLoading.set(false);
    })
  }

  receiveMessages(messages:IMessage[]){
    this.chatMessages.update(curr => [...messages,...curr]);
    this.isLoading.update(()=>false);
    console.log(messages)

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
