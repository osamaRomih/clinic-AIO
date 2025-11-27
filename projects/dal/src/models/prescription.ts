export interface IPrescriptionItem {
  id: number;
  name: string;
  dosage: string;
  frequency: number;
  days: number;
  instructions?: string;
}

export interface IPrescriptionDetails {
  id: number;
  date: string;
  time: string;
  age: string;
  diagnosis: string;
  nextVisit: string;
  notes: string;
  patient: IPrescriptionPatientDetails;
  items: IPrescriptionItem[];
}

export interface IPrescription {
  id: number;
  patientId: number;
  patientName: string;
  date: string;
  age: number;
  diagnosis: string;
  notes?: string;
  items: IPrescriptionItem[];
}

export interface IPrescriptionPatientDetails {
  id: string;
  fullName: string;
  gender: 'male' | 'female' | string;
  address: string;
  imageUrl: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface IPrescriptionResponse {
  id: number;
  patientName: string;
  date: string;
  age: number;
  diagnosis: string;
  notes?: string;
}
