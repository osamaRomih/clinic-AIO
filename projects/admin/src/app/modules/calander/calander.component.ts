import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService } from 'DAL';
import moment from 'moment';

@Component({
  selector: 'app-calander',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calander.component.html',
  styleUrl: './calander.component.scss',
})
export class CalanderComponent implements OnInit {
  constructor(private service: AppointmentService) {}

  ngOnInit(): void {}

  private fetchAllEvents: CalendarOptions['events'] = (
    info,
    success,
    failure
  ) => {
    this.service
      .getAllInRange(info.startStr.split('T')[0], info.endStr.split('T')[0])
      .subscribe({
        next: (items) => {success(items)
          console.log(items)
        },
        error: (err) => failure(err),
      });
  };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.fetchAllEvents,
    eventContent: (arg) => {
      const {title,start} = arg.event; 
      const timeText = moment(start).format('hh:mm A');

      return {
        html: `<div class="fc-evt-inline">
          <span class="fc-evt-time">${timeText}</span>
          <span class="fc-evt-title">${title}</span>
        </div>`,
      };
    },
  };

  handleDateClick(arg: any) {
    console.log(this.calendarOptions.events);
    alert('date click! ' + arg.dateStr);
  }
}
