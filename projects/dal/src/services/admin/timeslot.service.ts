import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { DaySlotsResponse, ITimeSlot, ScheduleResponse, TimeSlotResponse } from '../../models/timeslot';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeslotService {

  baseAPI = 'http://localhost:5069/api';
  constructor(private httpClient: HttpClient) {}

  dayOfWeek = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
  timeSlots = signal<DaySlotsResponse[]>([]);

  timeSlotsByDay = computed(()=>{
    const grouped:{[key:string]:TimeSlotResponse[]} = {};

    this.timeSlots().map(item=>{
      const day = item.day;
      grouped[day]=item.timeSlots;
    })

    return grouped;

  })

  addTimeSlot(model:ITimeSlot,day:string){
    return this.httpClient.post(`${this.baseAPI}/days/${day}/timeslots`,model);
  }

  updateTimeSlot(id:number,model:ITimeSlot){
    return this.httpClient.put(`${this.baseAPI}/timeSlots/${id}`,model);
  }

  getAll(includeDeleted:boolean = false){
    var params = new HttpParams();

    params = params.append('includeDeleted', includeDeleted.toString());
    
    return this.httpClient.get<ScheduleResponse>(`${this.baseAPI}/timeslots`,{params}).pipe(
      tap(response=>{
          this.timeSlots.set(response.slots);
        return response;
      })
    );
  }

  toggleStatus(id:number){
    return this.httpClient.put(`${this.baseAPI}/timeSlots/${id}/toggle-status`,{});
  }
}
