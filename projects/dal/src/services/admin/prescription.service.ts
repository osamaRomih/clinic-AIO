import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPrescriptionResponse } from '../../public-api';
import { IPagedResponse } from '../../models/IPagedResponse';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  baseAPI = 'https://localhost:7096/api';

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
}
