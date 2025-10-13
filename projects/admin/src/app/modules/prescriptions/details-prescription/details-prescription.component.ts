import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IPrescription } from 'DAL';
import { MatIcon } from "@angular/material/icon";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-details-prescription',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogContent, MatDialogActions, MatIcon],
  templateUrl: './details-prescription.component.html',
  styleUrl: './details-prescription.component.scss'
})
export class DetailsPrescriptionComponent {

  prescription!:IPrescription;
  notes:SafeHtml | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IPrescription,
  private dialog:MatDialogRef<DetailsPrescriptionComponent>,
  private sanitizer: DomSanitizer){
    this.prescription = data;
    this.notes = this.sanitizer.bypassSecurityTrustHtml(this.prescription.notes!)
  }


  closeDialog(){
    this.dialog.close();
  }


}
