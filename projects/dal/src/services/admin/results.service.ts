import { Injectable } from '@angular/core';
import { IAppointmentsPerDay, IPatientsPerDay } from '../../models/results';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IAppointmentStatus } from '../../models/appointment-status';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  baseAPI = 'http://localhost:5069/api';
  constructor(private httpClient: HttpClient) {}

  getPatientsPerDay() {
    return this.httpClient.get<IPatientsPerDay[]>(`${this.baseAPI}/results/patients-per-day`);
  }

  getAppointmentsPerDay() {
    return this.httpClient.get<IAppointmentsPerDay[]>(`${this.baseAPI}/results/appointments-per-day`);
  }

  /**
   * period: 'daily' | 'weekly' | 'monthly' | 'yearly'
   * opts: optional { year?: number, start?: string (ISO), end?: string (ISO) }
   */
  getAppointmentStatus(period: string, opts?: { year?: number; start?: string; end?: string }): Observable<IAppointmentStatus> {
    let params = new HttpParams().set('period', period);

    if (opts?.year) params = params.set('year', String(opts.year));
    if (opts?.start) params = params.set('start', opts.start);
    if (opts?.end) params = params.set('end', opts.end);

    return this.httpClient.get<IAppointmentStatus>(this.baseAPI + '/results/appointment-status', { params });
  }
}
