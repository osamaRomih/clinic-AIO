export interface IPatientRead{
  id:string;
  fullName:string;
  imageUrl:string;
  phoneNumber:string;
  email:string;
  userName:string;
  lastVisit:string;
  gender:string;
  address:string;
  dateOfBirth:string;
}

export interface IPatientAdd{
  firstName: string;
  lastName: string;
  gender: string;
  address: string;
  dateOfBirth: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  image?: File | null; 
}

export interface IPatientUpdate{
  firstName: string;
  lastName: string;
  gender: string;
  address: string;
  dateOfBirth: string;
  userName: string;
  email: string;
  phoneNumber: string;
  image?: File | null; 
}
export interface IPatientActiveRead{
    id: string;
    fullName: string;
    imageUrl: string;
    phoneNumber: string;
}