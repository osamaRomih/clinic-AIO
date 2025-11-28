import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { IPrescriptionHistory } from 'DAL';

interface DisplayPrescription {
  issueDate: string;
  diagnosis: string;
  medications: string;
  notesSummary: SafeHtml;
}

@Component({
  selector: 'app-prescription-history',
  standalone: true,
  imports: [MatTableModule,TranslatePipe],
  templateUrl: './prescription-history.component.html',
  styleUrl: './prescription-history.component.scss',
})
export class PrescriptionHistoryComponent implements OnChanges {
  displayedColumns: string[] = ['issueDate', 'diagnosis', 'notesSummary', 'medications'];

  @Input() data:IPrescriptionHistory[]= [];
  mappedData:DisplayPrescription[] = [];
  dataSource = new MatTableDataSource<DisplayPrescription>([]);
  showAll = false;

  private sanitizer = inject(DomSanitizer);

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'] && this.data){
      const mappedData = this.data.map(item=>this.mapAndFormat(item));
      this.mappedData = mappedData;
      this.updateDataSource();
    }
  }

  mapAndFormat(item:IPrescriptionHistory):DisplayPrescription{
    const rawNotes = item.notes || '';
    
    return {
      issueDate: item.date,
      diagnosis: item.diagnosis,
      medications: (item.medicationItems || []).join(', '),
      notesSummary: this.sanitizer.bypassSecurityTrustHtml(rawNotes)
    };
  }

  updateDataSource(){
    if(this.showAll)
      this.dataSource.data = this.mappedData;
    else
      this.dataSource.data = this.mappedData.slice(0,5);
  }

  toggleView(event:Event){
    event.preventDefault();
    this.showAll=!this.showAll;
    this.updateDataSource();
  }
}
