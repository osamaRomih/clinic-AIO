import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITimeSlot, ScheduleResponse } from '../../models/timeslot';

@Injectable({
  providedIn: 'root'
})
export class TimeslotService {

  baseAPI = 'https://localhost:7096/api';
  constructor(private httpClient:HttpClient){
  }

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
    
    return this.httpClient.get<ScheduleResponse>(`${this.baseAPI}/timeslots`,{params});
  }

  deleteTimeSlot(id:number){
    return this.httpClient.delete(`${this.baseAPI}/timeSlots/${id}`);
  }
}
