import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import 'moment/locale/ar';

@Pipe({
  name: 'date',
  standalone: true
})
export class DatePipe implements PipeTransform {

  transform(value: string, format:string = 'YYYY-MM-DD'): string {
    if(!value)
      return '';

    const date = moment(value);

    if(!date.isValid())
      return '';

    return date.format(format);
  }

}
