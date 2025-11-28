import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IPrescriptionDetails, PrescriptionService } from 'DAL';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PrescriptionCardDetailsComponent } from './prescription-card-details/prescription-card-details.component';
import { PrescriptionPatientInfoComponent } from './prescription-patient-info/prescription-patient-info.component';
import { PrescriptionActionsComponent } from './prescription-actions/prescription-actions.component';

@Component({
  selector: 'app-details-prescription',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    PrescriptionCardDetailsComponent,
    PrescriptionPatientInfoComponent,
    PrescriptionActionsComponent,
    TranslatePipe,
  ],
  templateUrl: './details-prescription.component.html',
  styleUrl: './details-prescription.component.scss',
})
export class DetailsPrescriptionComponent implements OnInit {
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private prescriptionService = inject(PrescriptionService);

  patientId!: number;
  prescription!: IPrescriptionDetails;

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPrescription();
  }

  loadPrescription() {
    this.prescriptionService.getById(this.patientId).subscribe({
      next: (prescription) => {
        this.prescription = prescription;
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
