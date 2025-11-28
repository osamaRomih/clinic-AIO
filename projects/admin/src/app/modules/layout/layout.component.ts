import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { LanguageService, MenuItem, ResponsiveService } from 'DAL';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TranslateService } from '@ngx-translate/core';
import { Directionality } from '@angular/cdk/bidi';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatSidenavContainer, MatSidenav, MatSidenavContent, RouterOutlet, HeaderComponent, SideNavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  private responsiveService = inject(ResponsiveService);
  private languageService = inject(LanguageService);

  collapsed = signal(false);
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

  currentLang = toSignal(this.languageService.currentLanguage$, { initialValue: 'ar' });
  isRtl = computed(() => this.currentLang() === 'ar');

  constructor() {
    effect(
      () => {
        if (this.responsiveService.smallWidth()) {
          this.collapsed.set(true);
        } else {
          this.collapsed.set(false);
        }
      },
      { allowSignalWrites: true },
    );
  }

  toggleCollapsed() {
    this.collapsed.set(!this.collapsed());
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      lable: 'SIDENAV.DASHBOARD',
      route: '/dashboard',
    },
    {
      icon: 'event',
      lable: 'SIDENAV.APPOINTMENTS.MAIN',
      route: '/appointments',
      subItems: [
        {
          icon: 'list',
          lable: 'SIDENAV.APPOINTMENTS.VIEW_ALL',
          route: '/appointments',
        },
        {
          icon: 'calendar_today',
          lable: 'SIDENAV.APPOINTMENTS.CALENDAR',
          route: '/appointments/calendar',
        },
        {
          icon: 'add',
          lable: 'SIDENAV.APPOINTMENTS.ADD',
          route: '/appointments/add',
        },
      ],
    },
    {
      icon: 'description',
      lable: 'SIDENAV.PRESCRIPTIONS.MAIN',
      route: '/prescriptions',
      subItems: [
        {
          icon: 'list',
          lable: 'SIDENAV.PRESCRIPTIONS.VIEW_ALL',
          route: '/prescriptions',
        },
        {
          icon: 'add',
          lable: 'SIDENAV.PRESCRIPTIONS.ADD',
          route: '/prescriptions/add',
        },
      ],
    },
    {
      icon: 'access_time',
      lable: 'SIDENAV.AVAILABILITY',
      route: '/availability',
    },
    {
      icon: 'group',
      lable: 'SIDENAV.USERS',
      route: '/users',
    },
    {
      icon: 'chat',
      lable: 'SIDENAV.CHAT',
      route: '/chat',
    },
    {
      icon: 'settings',
      lable: 'SIDENAV.SETTINGS.MAIN',
      route: '',
      subItems: [
        {
          icon: 'person',
          lable: 'SIDENAV.SETTINGS.PROFILE',
          route: '/profile',
        },
        {
          icon: 'lock',
          lable: 'SIDENAV.SETTINGS.CHANGE_PASSWORD',
          route: '/change-password',
        },
      ],
    },
    {
      icon: 'persons',
      lable: 'SIDENAV.PATIENTS.MAIN',
      route: '/patients',
      subItems: [
        {
          icon: 'person',
          lable: 'SIDENAV.PATIENTS.VIEW_ALL',
          route: '/patients',
        },
        {
          icon: 'add',
          lable: 'SIDENAV.PATIENTS.ADD',
          route: '/patients/add',
        },
      ],
    },
  ]);
}
