import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { IPrescriptionDetails, IPrescriptionItem } from 'DAL';

@Component({
  selector: 'app-prescription-card-details',
  standalone: true,
  imports: [MatCardModule, MatTableModule, TranslatePipe],
  templateUrl: './prescription-card-details.component.html',
  styleUrl: './prescription-card-details.component.scss',
})
export class PrescriptionCardDetailsComponent implements OnChanges {
  @Input() prescription!: IPrescriptionDetails;
  displayedColumns: string[] = ['id', 'name', 'dosage', 'frequency', 'days', 'instructions'];

  dataSource = new MatTableDataSource<IPrescriptionItem>([]);
  protected sanitizer = inject(DomSanitizer);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prescription'] && this.prescription) {
      this.dataSource.data = this.prescription.items || [];
    }
  }
}
