import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRoleResponse } from '../../models/role-response';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
baseAPI = 'https://localhost:7096/api';

  constructor(private httpClient:HttpClient) { }


  getAll(includeDisabled:boolean = false){
    var params = new HttpParams();
    params = params.append('includeDisabled',includeDisabled);
    return this.httpClient.get<IRoleResponse[]>(`${this.baseAPI}/roles`,{params});
  }
}
