import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagedResponse } from '../../models/IPagedResponse';
import { IAppointmentRead } from '../../models/appointment-read';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseAPI = 'https://localhost:7096/api';

  constructor(private httpClient:HttpClient) { }

  create(model:any){
    return this.httpClient.post(`${this.baseAPI}/appointments`,model);
  }

  getAll(pageNumber:number,pageSize:number){
    var params = new HttpParams();
    params = params.append('pageNumber',pageNumber);
    params = params.append('pageSize',pageSize);

    return this.httpClient.get<IPagedResponse<IAppointmentRead>>(`${this.baseAPI}/appointments`,{params});
  }

  // getById(id:number){
  //   return this.httpClient.get<IPrescription>(`${this.baseAPI}/prescriptions/${id}`);
  // }

  // update(id:number,model:any){
  //   return this.httpClient.put(`${this.baseAPI}/prescriptions/${id}`,model);
  // }

  // delete(id:number){
  //   return this.httpClient.delete(`${this.baseAPI}/prescriptions/${id}`);
  // }
}
