import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService } from 'DAL';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-calender',
  standalone: true,
  imports: [
    MatIconModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    FullCalendarModule,
  ],
  templateUrl: './appointment-calender.component.html',
  styleUrl: './appointment-calender.component.scss',
})
export class AppointmentCalenderComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);

  ngOnInit(): void {}

  private fetchAllEvents: CalendarOptions['events'] = (
    info,
    success,
    failure
  ) => {
    this.appointmentService
      .getAllInRange(info.startStr.split('T')[0], info.endStr.split('T')[0])
      .subscribe({
        next: (items) => {
          success(items);
          console.log(items);
        },
        error: (err) => failure(err),
      });
  };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: this.fetchAllEvents,
    eventContent: (arg) => {
      const { title } = arg.event;
      const status = arg.event.extendedProps['status'];
      const imageUrl = arg.event.extendedProps['image'];

      const statusClass = status
        ? `status-${status.toLowerCase()}`
        : 'status-default';

      return {
        html: `<div class="event-item ${statusClass}">
                <img src="${
                  'http://localhost:5069/' + imageUrl
                }" class="fc-event-avatar"/>
                <span class="fc-event-title-custom">${title}</span>
               </div>`,
      };
    },
    eventClick: (arg:any) => {
    this.router.navigate(['/appointments/edit', arg.event.id]);
  },
  };

}
