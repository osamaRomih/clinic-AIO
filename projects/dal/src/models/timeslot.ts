export interface ITimeSlot {
    id?:number;
    startTime:string;
    endTime:string;
}

export interface WeeklyScheduleResponse {
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
  isActive: boolean;
}
