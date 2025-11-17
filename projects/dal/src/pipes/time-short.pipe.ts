import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'timeShort',
  standalone: true
})
export class TimeShortPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    console.log('value',value);

    if(!value)
      return '';
    return moment(value, 'HH:mm:ss').format('hh:mm A');
  }

}
