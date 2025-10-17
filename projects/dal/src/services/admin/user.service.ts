import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserResponse } from '../../public-api';

@Injectable({
  providedIn: 'root'
})
export class UserService {
baseAPI = 'https://localhost:7096/api';

  constructor(private httpClient:HttpClient) { }


  getAll(){
    return this.httpClient.get<IUserResponse[]>(`${this.baseAPI}/users`);
  }

  add(model:any){
    return this.httpClient.post(`${this.baseAPI}/users`,model);
  }
}
