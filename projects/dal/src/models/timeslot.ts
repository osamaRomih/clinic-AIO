export interface ITimeSlot {
    id?:number;
    startTime:string;
    endTime:string;
}

export interface ScheduleResponse {
  slots: DaySlotsResponse[];
}

export interface DaySlotsResponse {
  day: string;
  timeSlots: TimeSlotResponse[];
}

export interface TimeSlotResponse {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
