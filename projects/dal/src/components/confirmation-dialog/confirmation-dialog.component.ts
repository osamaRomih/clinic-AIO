import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogData } from '../../models/confirmation-dialog-data';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'lib-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule,MatIconModule,MatButtonModule,MatCardModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {

  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

}
