export interface IMessage{
  id:number;
  senderId:string;
  receiverId:string;
  content:string;
  createdDate:string;
  isRead:boolean;
}