import { Component, Inject, inject, OnInit } from '@angular/core';
// import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment'
import { ToastrService } from 'ngx-toastr';
import { ITimeSlot, TimeslotService } from 'DAL';

@Component({
  selector: 'app-time-slot-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,MatError, MatIcon,MatDialogContent,MatDialogTitle,MatDialogActions,ReactiveFormsModule,MatButton],
  templateUrl: './time-slot-form.component.html',
  styleUrl: './time-slot-form.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class TimeSlotFormComponent implements OnInit {

  timeSlotForm!:FormGroup;
  constructor(
    private dialogRef:MatDialogRef<TimeSlotFormComponent>,
    private fb:FormBuilder,
    private timeSlotService:TimeslotService,
    private toastr:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data?:{day:string,timeSlot?:ITimeSlot},
  ){}

  ngOnInit(): void {
    this.createForm();
    
  }

  createForm(){
    this.timeSlotForm = this.fb.group({
      startTime:[ moment(this.data?.timeSlot?.startTime, 'HH:mm:ss').toDate() || '' ,[Validators.required]],
      endTime:[moment(this.data?.timeSlot?.endTime, 'HH:mm:ss').toDate() || '',[Validators.required]]
    });

  }
  
  closeDiaglog(){
    this.dialogRef.close();
  }

  addTimeSlot(){
    const { startTime, endTime } = this.timeSlotForm.value;

    let model:ITimeSlot = {
      startTime:moment(startTime).format('HH:mm'),
      endTime: moment(endTime).format('HH:mm'),
    };

    this.timeSlotService.addTimeSlot(model,this.data?.day!).subscribe({
      next:(res)=>{
        this.toastr.success('Time is created successfully!');
        this.dialogRef.close(true);
      }
    })
  }

  updateTimeSlot(id:number){
    const { startTime, endTime } = this.timeSlotForm.value;

    let model:ITimeSlot = {
      startTime:moment(startTime).format('HH:mm'),
      endTime: moment(endTime).format('HH:mm'),
    };

    this.timeSlotService.updateTimeSlot(id,model).subscribe({
      next:(res)=>{
        this.toastr.success('Time is updated successfully!');
        this.dialogRef.close(true);
      }
    })
  }
  

  
}
