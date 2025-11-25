export interface IPatientProfileDetails {
  patientInformation: IPatientInformation;
  appointmentHistory: IAppointmentHistory[];
  prescriptionHistory: IPrescriptionHistory[];
}

export interface IPatientInformation{
    patientId: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    age: number;
    email: string;
    phoneNumber: string;
    address: string;
    imageUrl: string;
    status: string;
  }

export interface IAppointmentHistory {
  appointmentId: number;
  date: string;
  time: string;
  status: string;
  reasonForVisit: string;
  visitType: string;
}
export interface IPrescriptionHistory {
  prescriptionId: number;
  date: string;
  diagnosis: string;
  notes: string;
  medicationItems: string[];
}
