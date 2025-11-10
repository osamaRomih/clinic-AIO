export interface IAppointmentEvent{
  id: number;
  date: string;  
  startTime: string; 
  endTime:string;   
  doctorName: string;
  patientName:string;
  image:string;
  status: string;
}