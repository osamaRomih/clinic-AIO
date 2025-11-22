export interface IUser {
  id:string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  userName: string;
  imageUrl?:string;
}

export interface IChatUser{
  id:string;
  firstName:string;
  lastName:string;
  phoneNumber?: string;
  userName: string;
  imageUrl?:string;
  isOnline:boolean;
  lastSeen?:string;
  isTyping:boolean;
  unReadCount:number;
}