import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IActivePatient } from '../../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  baseAPI = 'https://localhost:7096/api';

  constructor(private httpClient:HttpClient) { }

  getAllActive(){
    return this.httpClient.get<IActivePatient[]>(`${this.baseAPI}/patients/active`);
  }
}
