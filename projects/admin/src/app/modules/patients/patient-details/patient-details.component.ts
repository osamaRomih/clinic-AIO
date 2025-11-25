import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { PrescriptionHistoryComponent } from "../../prescriptions/prescription-history/prescription-history.component";
import { AppointmentHistoryComponent } from '../../appointments/appointment-history/appointment-history.component';
import { IPatientProfileDetails, PatientService } from 'DAL';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [MatIconModule, MatCardModule, TranslatePipe, PrescriptionHistoryComponent, AppointmentHistoryComponent],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss'
})
export class PatientDetailsComponent implements OnInit {
  patientId!:string;
  patient!:IPatientProfileDetails;

  private patientService = inject(PatientService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';

    this.loadPatient();
  }

  loadPatient(){
    this.patientService.getProfileDetails(this.patientId).subscribe({
      next:(res)=>{
        this.patient = res;
      }
    })
  }
}
