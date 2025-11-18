import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPatientRead } from '../../models/patient';
import { IPagedResponse } from '../../models/IPagedResponse';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  baseAPI = 'http://localhost:5069/api';

  constructor(private httpClient: HttpClient) {}

  getAllActive() {
    return this.httpClient.get<IPatientRead[]>(`${this.baseAPI}/patients/active`);
  }

  getAll(pageNumber: number, pageSize: number,searchBy?:string, sortBy?:string,sortDirection?:string) {
    var params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    if(searchBy!=undefined)
      params = params.append('searchValue',searchBy);
    if(sortBy!=undefined && sortDirection!=undefined)
      params = params.append('SortColumn',sortBy).append('SortDirection',sortDirection);
        

    return this.httpClient.get<IPagedResponse<IPatientRead>>(`${this.baseAPI}/patients`, { params });
  }

  getById(id:string){
    return this.httpClient.get<IPatientRead>(`${this.baseAPI}/patients/${id}`);
  }

  create(formData:FormData){
    return this.httpClient.post<IPatientRead>(`${this.baseAPI}/patients`, formData);
  }

  update(id:string, formData:FormData){
    return this.httpClient.put(`${this.baseAPI}/patients/${id}`, formData);
  }

  delete(id: string) {
    return this.httpClient.delete<void>(`${this.baseAPI}/patients/${id}`);
  }

  deleteMany(ids:number[]){
    return this.httpClient.request<void>('DELETE',`${this.baseAPI}/patients`,{body:{ids}})
  }

}
