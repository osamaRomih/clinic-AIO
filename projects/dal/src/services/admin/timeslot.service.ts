import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DaySlotsResponse, ITimeSlot, ScheduleResponse } from '../../models/timeslot';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeslotService {

  baseAPI = 'http://localhost:5069/api';
  private httpClient = inject(HttpClient);

  timeSlots = signal<DaySlotsResponse[]>([]);

  addTimeSlot(model:ITimeSlot,day:string){
    return this.httpClient.post(`${this.baseAPI}/days/${day}/timeslots`,model);
  }

  updateTimeSlot(id:number,model:ITimeSlot){
    return this.httpClient.put(`${this.baseAPI}/timeSlots/${id}`,model);
  }

  getAll(date?:string){
    var params = new HttpParams();
    if(date!=undefined)
      params = params.append('date',date);
    
    return this.httpClient.get<ScheduleResponse>(`${this.baseAPI}/timeslots`,{params}).pipe(
      tap(response=>{
          this.timeSlots.set(response.slots);
        return response;
      })
    );
  }

  deleteTimeSlot(id:number){
    return this.httpClient.delete(`${this.baseAPI}/timeSlots/${id}`);
  }
}
