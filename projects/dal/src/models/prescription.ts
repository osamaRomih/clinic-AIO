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
  patientName?: string; 
  date: string;    
  age: number;
  diagnosis: string;
  nextVisit: string;
  notes?: string;
  items: IPrescriptionItem[];
  totalItems?: number; 
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

export const MOCK_PRESCRIPTIONS: IPrescription[] = [
  {
    id: 1,
    patientId: 101,
    patientName: 'John Doe',
    date: '2025-10-10T10:00:00Z',
    age: 32,
    diagnosis: 'Flu',
    nextVisit: '2025-10-17T10:00:00Z',
    notes: 'Drink fluids and rest well.',
    totalItems: 3,
    items: [
      { id: 1, name: 'Paracetamol', dosage: '500mg', frequency: 3, days: 5, instructions: 'After meals' },
      { id: 2, name: 'Cough Syrup', dosage: '10ml', frequency: 2, days: 7, instructions: 'Before sleep' },
      { id: 3, name: 'Vitamin C', dosage: '1000mg', frequency: 1, days: 10, instructions: 'Morning' }
    ]
  },
  {
    id: 2,
    patientId: 102,
    patientName: 'Sarah Smith',
    date: '2025-10-11T09:30:00Z',
    age: 45,
    diagnosis: 'Diabetes Checkup',
    nextVisit: '2025-11-11T09:30:00Z',
    notes: 'Continue regular insulin dose.',
    totalItems: 2,
    items: [
      { id: 4, name: 'Metformin', dosage: '500mg', frequency: 2, days: 30 },
      { id: 5, name: 'Insulin', dosage: '10 units', frequency: 1, days: 30, instructions: 'Before breakfast' }
    ]
  },
  {
    id: 3,
    patientId: 103,
    patientName: 'Ali Hassan',
    date: '2025-10-12T14:00:00Z',
    age: 29,
    diagnosis: 'Allergy',
    nextVisit: '2025-10-19T14:00:00Z',
    notes: 'Avoid allergens, use medication as needed.',
    totalItems: 1,
    items: [
      { id: 6, name: 'Antihistamine', dosage: '10mg', frequency: 1, days: 14, instructions: 'At night' }
    ]
  },
  {
    id: 3,
    patientId: 103,
    patientName: 'Ali Hassan',
    date: '2025-10-12T14:00:00Z',
    age: 29,
    diagnosis: 'Allergy',
    nextVisit: '2025-10-19T14:00:00Z',
    notes: 'Avoid allergens, use medication as needed.',
    totalItems: 1,
    items: [
      { id: 6, name: 'Antihistamine', dosage: '10mg', frequency: 1, days: 14, instructions: 'At night' }
    ]
  },
  {
    id: 3,
    patientId: 103,
    patientName: 'Ali Hassan',
    date: '2025-10-12T14:00:00Z',
    age: 29,
    diagnosis: 'Allergy',
    nextVisit: '2025-10-19T14:00:00Z',
    notes: 'Avoid allergens, use medication as needed.',
    totalItems: 1,
    items: [
      { id: 6, name: 'Antihistamine', dosage: '10mg', frequency: 1, days: 14, instructions: 'At night' }
    ]
  },
  {
    id: 3,
    patientId: 103,
    patientName: 'Ali Hassan',
    date: '2025-10-12T14:00:00Z',
    age: 29,
    diagnosis: 'Allergy',
    nextVisit: '2025-10-19T14:00:00Z',
    notes: 'Avoid allergens, use medication as needed.',
    totalItems: 1,
    items: [
      { id: 6, name: 'Antihistamine', dosage: '10mg', frequency: 1, days: 14, instructions: 'At night' }
    ]
  },
  {
    id: 3,
    patientId: 103,
    patientName: 'Ali Hassan',
    date: '2025-10-12T14:00:00Z',
    age: 29,
    diagnosis: 'Allergy',
    nextVisit: '2025-10-19T14:00:00Z',
    notes: 'Avoid allergens, use medication as needed.',
    totalItems: 1,
    items: [
      { id: 6, name: 'Antihistamine', dosage: '10mg', frequency: 1, days: 14, instructions: 'At night' }
    ]
  },
  {
    id: 3,
    patientId: 103,
    patientName: 'Ali Hassan',
    date: '2025-10-12T14:00:00Z',
    age: 29,
    diagnosis: 'Allergy',
    nextVisit: '2025-10-19T14:00:00Z',
    notes: 'Avoid allergens, use medication as needed.',
    totalItems: 1,
    items: [
      { id: 6, name: 'Antihistamine', dosage: '10mg', frequency: 1, days: 14, instructions: 'At night' }
    ]
  }
];