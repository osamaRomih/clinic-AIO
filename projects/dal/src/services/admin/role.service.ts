import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRoleResponse } from '../../models/role-response';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  baseAPI = 'http://localhost:5069/api';
  private rolesCache:IRoleResponse[] | null = null;
  constructor(private httpClient: HttpClient) {}

  getAll(includeDisabled: boolean = false) {
    var params = new HttpParams();
    params = params.append('includeDisabled', includeDisabled);


    if(this.rolesCache){
      return of(this.rolesCache);
    }else{
      
    return this.httpClient.get<IRoleResponse[]>(`${this.baseAPI}/roles`, {params}).pipe(
      map(res=>{
        this.rolesCache = res
        return res;
      })
    )
    }
    

  }
}
