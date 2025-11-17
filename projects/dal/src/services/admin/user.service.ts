import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserRead } from '../../public-api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseAPI = 'http://localhost:5069/api';

  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get<IUserRead[]>(`${this.baseAPI}/users`);
  }

  getById(id: string) {
    return this.httpClient.get<IUserRead>(`${this.baseAPI}/users/${id}`);
  }

  add(model: any) {
    return this.httpClient.post(`${this.baseAPI}/users`, model);
  }

  update(id: string, model: any) {
    return this.httpClient.put(`${this.baseAPI}/users/${id}`, model);
  }

  toggleStatus(id: string) {
    return this.httpClient.put(`${this.baseAPI}/users/${id}/toggle-status`, {});
  }

  unlock(id: string) {
    return this.httpClient.put(`${this.baseAPI}/users/${id}/unlock`, {});
  }
}
