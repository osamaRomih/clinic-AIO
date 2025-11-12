import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagedResponse } from '../../models/IPagedResponse';
import { IAppointment, IAppointmentRead } from '../../models/appointment-read';
import { map, Observable } from 'rxjs';
import { IAppointmentEvent } from '../../models/appointment-event';
import { EventInput } from '@fullcalendar/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  baseAPI = 'https://localhost:7096/api';

  constructor(private httpClient: HttpClient) {}

  create(model: any) {
    return this.httpClient.post(`${this.baseAPI}/appointments`, model);
  }

  getAll(pageNumber: number, pageSize: number) {
    var params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return this.httpClient.get<IPagedResponse<IAppointmentRead>>(
      `${this.baseAPI}/appointments`,
      { params }
    );
  }

  getAllInRange(start: string, end: string):Observable<EventInput[]> {
    return this.httpClient
      .get<IAppointmentEvent[]>(
        `${this.baseAPI}/appointments/range?start=${start}&end=${end}`
      )
      .pipe(
        map((items) =>
          items.map((item) => {
            return {
              id: String(item.id),
              title:item.patientName,
              start: moment(new Date(`${item.date} ${item.startTime}`), 'YYYY-MM-DD HH:mm').format(),
              end: moment(new Date(`${item.date} ${item.endTime}`), 'YYYY-MM-DD HH:mm').format(),
              backgroundColor: item.status == 'Booked' ? '#2196f3' : '#f44336',
              extendedProps:{
                image:item.image,
                status:item.status
              }
            } as EventInput;
          })
        )
      );
  }

  deleteMany(ids:number[]){
    return this.httpClient.request<void>('DELETE',`${this.baseAPI}/appointments`,{body:{ids}})
  }

  delete(id:number){
    return this.httpClient.delete<void>(`${this.baseAPI}/appointments/${id}`);
  }


  getById(id:number){
    return this.httpClient.get<IAppointment>(`${this.baseAPI}/appointments/${id}`);
  }

  update(id:number,model:any){
    return this.httpClient.put(`${this.baseAPI}/appointments/${id}`,model);
  }

  // delete(id:number){
  //   return this.httpClient.delete(`${this.baseAPI}/prescriptions/${id}`);
  // }
}
