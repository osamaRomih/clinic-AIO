export interface IAppointmentRead {
  id: number;
  imageUrl: string;
  patientName: string;
  phoneNumber: string;
  email:string;
  gender:string;
  address:string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  reasonForVisit: string;
  visitType: string;
  createdOn: string;
}

export interface IAppointment{
  id:number,
  date: string,
  status: string,
  patientId: string,
  patientName: string,
  reasonForVisit:string,
  visitType:string,
  timeslotId:Int16Array,
  patientPhoneNumber: string
}