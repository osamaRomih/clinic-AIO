import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogData } from '../models/confirmation-dialog-data';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialog = inject(MatDialog);

  confirmDialog(title:string,message:string): Observable<boolean> {
    const data: ConfirmDialogData = {
      title,
      message,
      confirmCaption: 'Yes',
      cancelCaption: 'No'
    };
    
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data,
        width: '450px',
        disableClose: true,
      })
      .afterClosed();
  }
}
