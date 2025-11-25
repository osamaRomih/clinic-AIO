import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChip, MatChipListbox } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { IAppointmentHistory } from 'DAL';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Interface defining the structure of a single appointment record.
 */
export interface Appointment {
  date: string;
  visitType: string;
  reasonForVisit: string;
  status: 'Discharged' | 'Completed' | 'Scheduled'; // Define possible statuses
}

// Example Data matching the screenshot
const APPOINTMENT_DATA: Appointment[] = [
  {
    date: '2023-11-10',
    visitType: 'Emergency',
    reasonForVisit: 'Severe Asthma Attack',
    status: 'Discharged',
  },
  {
    date: '2023-08-05',
    visitType: 'Routine',
    reasonForVisit: 'Annual Checkup',
    status: 'Completed',
  },
  {
    date: '2024-01-20',
    visitType: 'Follow-up',
    reasonForVisit: 'Follow-up Consultation',
    status: 'Scheduled',
  },
];

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [MatTableModule, MatChipListbox, MatChip, CommonModule,TranslatePipe],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss',
})
export class AppointmentHistoryComponent implements OnChanges {
  displayedColumns: string[] = ['date', 'visitType', 'reasonForVisit', 'status'];
  dataSource = new MatTableDataSource<IAppointmentHistory>([]);
  showAll = false;

  @Input() data: IAppointmentHistory[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateDataSource();
    }
  }

  updateDataSource(){
    if(this.showAll)
      this.dataSource.data = this.data;
    else
      this.dataSource.data = this.data.slice(0,5);
  }

  toggleView(event:Event){
    event.preventDefault();
    this.showAll=!this.showAll;
    this.updateDataSource();
  }
}
