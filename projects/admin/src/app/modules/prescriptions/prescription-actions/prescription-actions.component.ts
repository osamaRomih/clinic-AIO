import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogService, PrescriptionService } from 'DAL';

@Component({
  selector: 'app-prescription-actions',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './prescription-actions.component.html',
  styleUrl: './prescription-actions.component.scss',
})
export class PrescriptionActionsComponent {
  @Input() prescriptionId!: number;

  private router = inject(Router);
  private confirmationDialog = inject(DialogService);
  private prescriptionService = inject(PrescriptionService);

  editPrescription() {
    this.router.navigate(['/prescriptions/edit', this.prescriptionId]);
  }

  deletePrescription() {
    this.confirmationDialog.confirmDialog('Delete Prescription', 'Are you sure you want to delete this prescription?').subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.prescriptionService.delete(this.prescriptionId).subscribe({
            next: () => {
              this.router.navigateByUrl('/prescriptions');
            },
          });
        }
      },
    });
  }

  printPrescription() {
    this.prescriptionService.printPrescription(this.prescriptionId).subscribe({
      next: (response) => {
        const pdfBlob = new Blob([response.body!], { type: 'application/pdf' });
        //Extract Filename from Headers
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = `prescription_${this.prescriptionId}.pdf`;
        if (contentDisposition) {
          // Regex to find 'filename=' or 'filename*=' in the header value
          const matches = contentDisposition.match(/filename\*?=['"]?([^'"]*)/i);
          if (matches && matches.length > 1) {
            // Decode the filename (especially for non-ASCII characters like UTF-8)
            fileName = decodeURIComponent(matches[1].replace(/UTF-8''/, ''));
          }
        }
        // Create a temporary URL for the Blob data
        const url = window.URL.createObjectURL(pdfBlob);

        // Create and configure the download link
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;

        // 4. Trigger download and cleanup
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        console.log(`Download started for file: ${fileName}`);
      },
      error: (err) => {
        console.error('Error downloading the prescription PDF:', err);
      },
    });
  }
}
