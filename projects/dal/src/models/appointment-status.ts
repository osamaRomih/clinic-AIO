export interface IAppointmentStatus {
  allAppointmentsCount: number;
  cancelledCount: number;
  bookedCount: number;
  completedCount: number;
  segmentStatus: AppointmentStatusSegment[];
}

export interface AppointmentStatusSegment {
  label: string;
  completed: number;
  booked: number;
  cancelled: number;
}
