export interface IUser {
  id:string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userName: string;
  imageUrl?:string;
  isOnline:boolean;
  lastSeen?:string;
  unReadCount:number;
}
