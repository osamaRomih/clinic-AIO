export interface IPrescriptionItem {
  id: number;
  name: string;
  dosage: string;
  frequency: number;
  days: number;
  instructions?: string;
}

export interface IPrescription {
  id: number;
  patientId: number;
  patientName:string;
  date: string;    
  age: number;
  diagnosis: string;
  nextVisit: string;
  notes?: string;
  items: IPrescriptionItem[];
}

export interface IPrescriptionResponse {
  id: number;
  patientName: string;
  date: string;        
  age: number;
  diagnosis: string;
  nextVisit: string;
  notes?: string;
}

