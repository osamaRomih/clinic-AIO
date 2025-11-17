import { inject, Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { IMessage } from '../../models/message';
import { IChatUser } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private hubUrl = 'http://localhost:5069/hubs/chat';
  allUsers = signal<IChatUser[]>([]);
  userId?: string;
  currentOpenedChat = signal<IChatUser | null>(null);
  chatMessages = signal<IMessage[]>([]);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);
  autoScrollEnabled = signal<boolean>(true);

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

    this.hubConnection.on('ReceiveMessageList', (messages: IMessage[],totalPages:number) => {
      this.totalPages.set(totalPages);
      this.isLoading.set(true);
      this.receiveMessages(messages);
      console.log(totalPages)
      console.log(messages)
      this.isLoading.set(false);

    });

    this.hubConnection.on('ReceiveNewMessage', (message: IMessage) => {
      this.receiveNewMessage(message);
    });

    this.hubConnection.on('NotifyOnlineUser',(user:IChatUser)=>{
      this.displayNotification(user);
    });

    this.hubConnection.on('NotifyTypingToUser',(id:string)=>{
      this.notifyTypingToUser(id);
    })
  }

  search(name:string){
    

  }

  applyUsers(users: IChatUser[]) {
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
    this.isLoading.set(true);
    this.hubConnection
      ?.invoke('LoadMessages', this.currentOpenedChat()?.id, pageNumber)
      .then()
      .catch()
      .finally(() => {
      });
  }

  displayNotification(user:IChatUser){
    Notification.requestPermission().then((result)=>{
      console.log(result)
      if(result=="granted"){

        new Notification('Active Now',{
          body:user.firstName + ' ' + user.lastName + "is online now",
          icon:'http://localhost:5069'+user.imageUrl
        })
      }
    })
  }

  receiveMessages(messages: IMessage[]) {
    this.chatMessages.update((curr) => [...messages, ...curr]);
    this.isLoading.update(() => false);
  }

  receiveNewMessage(message: IMessage) {
    if(this.currentOpenedChat()?.id == message.senderId)
      this.chatMessages.update((curr) => [...curr, message]);
  }

  notifyTypingToUser(id:string){
    this.allUsers.update(users=>
      users.map(user=>{
        if(user.id==id){
          user.isTyping=true;
        }
        return user;
      })
    );

    if(this.typingTimeouts[id])
      clearTimeout(this.typingTimeouts[id]);

    this.typingTimeouts[id] = setTimeout(() => {
      this.allUsers.update(users=>
        users.map(user=>{
          if(user.id==id){
            user.isTyping=false;
          }
          return user
        })
      );
      delete this.typingTimeouts[id];
    }, 2000);

      console.log(this.allUsers())
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

  typing(){
    this.hubConnection?.invoke('NotifyTyping',this.currentOpenedChat()?.id)
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
