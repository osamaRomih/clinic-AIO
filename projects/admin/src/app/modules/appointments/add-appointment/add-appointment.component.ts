import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
} from '@angular/material/card';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MatOption } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { AppointmentService, ScheduleResponse, TimeSlotResponse, TimeslotService } from 'DAL';
import { DatePipe } from '@angular/common';
import { MatButton, MatButtonModule } from "@angular/material/button";
import moment from 'moment';
@Component({
  selector: 'app-add-appointment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule
],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent implements OnInit {
  constructor(private timeSlotService:TimeslotService,private appointmentService:AppointmentService,private fb: FormBuilder) {}

  timeSlots:TimeSlotResponse[] = [];
  appointmentForm!: FormGroup;

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.appointmentForm = this.fb.group({
      patientId: [0, [Validators.required]],
      timeSlotId: [0, [Validators.required]],
      date: ['', [Validators.required]],
      reasonForVisit: ['', [Validators.required]],
      visitType: ['', [Validators.required]],
    });
  }

  getTimeSlots(event:MatDatepickerInputEvent<Date>){
    if (!event.value) return;

    const date = event.value.toISOString().split('T')[0];
    this.timeSlotService.getAll(date).subscribe({
      next:(res)=>{
        this.timeSlots = res.slots.length > 0 ? res.slots[0].timeSlots : []
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  onSubmit(){
    const {date,...rest} = this.appointmentForm.value;
    const model = {
      ...rest,
      date:moment(date).format('YYYY-MM-DD'),
      doctorId:1
    }
    this.appointmentService.create(model).subscribe({
      next:()=>{},
      error:()=>{}
    })
  }
}
