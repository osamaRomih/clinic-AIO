export interface IAppointmentPatient {
  id: string;
  fullName: string;
  gender: string;
  address: string;
  imageUrl: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface IAppointmentDetails {
  id: number;
  patientId: string;
  date: string;
  status: string;
  timeSlotId: number;
  startTime: string;
  endTime: string;
  reasonForVisit: string;
  visitType: string;
  patient: IAppointmentPatient;
}
