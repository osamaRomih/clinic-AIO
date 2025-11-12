export interface IUserRead {
  id: string;
  firstName: string;
  lastName?: string;
  userName: string;
  phoneNumber?: string;
  isLocked:boolean,
  isDisabled:boolean,
  email: string;
  roles: string[];
}

export interface IUser{
  id:string;
  firstName:string;
  lastName:string;
  userName:string;
  imageUrl:string;
  isOnline:boolean;
  unReadCount:number;
}