import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPatient } from '../../models/patient';
import { IPagedResponse } from '../../models/IPagedResponse';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  baseAPI = 'http://localhost:5069/api';

  constructor(private httpClient:HttpClient) { }

  getAllActive(){
    return this.httpClient.get<IPatient[]>(`${this.baseAPI}/patients/active`);
  }
}
