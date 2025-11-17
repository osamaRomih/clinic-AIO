import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPrescriptionResponse } from '../../public-api';
import { IPagedResponse } from '../../models/IPagedResponse';
import { IPrescription } from '../../models/prescription'

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  baseAPI = 'http://localhost:5069/api';

  constructor(private httpClient:HttpClient) { }

  create(model:any){
    return this.httpClient.post(`${this.baseAPI}/prescriptions`,model);
  }

  getAll(pageNumber:number,pageSize:number){
    var params = new HttpParams();
    params = params.append('pageNumber',pageNumber);
    params = params.append('pageSize',pageSize);

    return this.httpClient.get<IPagedResponse<IPrescriptionResponse>>(`${this.baseAPI}/prescriptions`,{params});
  }

  getById(id:number){
    return this.httpClient.get<IPrescription>(`${this.baseAPI}/prescriptions/${id}`);
  }

  update(id:number,model:any){
    return this.httpClient.put(`${this.baseAPI}/prescriptions/${id}`,model);
  }

  delete(id:number){
    return this.httpClient.delete(`${this.baseAPI}/prescriptions/${id}`);
  }
}
