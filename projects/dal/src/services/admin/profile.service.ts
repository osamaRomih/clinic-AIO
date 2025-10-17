import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseAPI = 'https://localhost:7096/api';
  constructor(private httpClient:HttpClient) { }

  updateProfile(formData:FormData){
    return this.httpClient.put(`${this.baseAPI}/me/info`,formData);
  }

  changePassword(model:any){
    return this.httpClient.put(`${this.baseAPI}/me/change-password`,model);
  }
}
