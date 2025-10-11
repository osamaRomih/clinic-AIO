import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-prescription',
  standalone: true,
  imports: [MatButton],
  templateUrl: './all-prescription.component.html',
  styleUrl: './all-prescription.component.scss'
})
export class AllPrescriptionComponent {
  constructor(private router:Router){}
  addPrescription(){
    this.router.navigateByUrl('prescriptions/add-prescription');
  }
}
