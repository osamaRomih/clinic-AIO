import { inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private translateService = inject(TranslateService);
  private langChangeSubscription: Subscription;

  constructor() {
    this.langChangeSubscription = this.translateService.onLangChange.subscribe((event) => {
      moment.locale(event.lang);
    });

    moment.locale(this.translateService.getCurrentLang());
  }

  transform(value: string | Date | null | undefined): string {
    if (!value) return this.translateService.instant('TIME_AGO.DEFAULT');

    const prefix = this.translateService.instant('TIME_AGO.PREFIX');
    const timeFromNow = moment(value).fromNow();

    return `${prefix} ${timeFromNow}`;
  }

  // Clean up the subscription
  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }
}
