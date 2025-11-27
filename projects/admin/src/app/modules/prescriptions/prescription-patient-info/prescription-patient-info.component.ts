import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IPrescriptionPatientDetails } from 'DAL';

@Component({
  selector: 'app-prescription-patient-info',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './prescription-patient-info.component.html',
  styleUrl: './prescription-patient-info.component.scss',
})
export class PrescriptionPatientInfoComponent {
  @Input() patient!: IPrescriptionPatientDetails;

  private router = inject(Router);

  viewPatientProfile() {
    this.router.navigate(['/patients/profile', this.patient.id]);
  }
}
