import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  MatSidenavContainer,
  MatSidenav,
  MatSidenavContent,
} from '@angular/material/sidenav';
import {
  HeaderComponent,
  MenuItem,
  ResponsiveService,
  SideNavComponent,
} from 'DAL';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    RouterOutlet,
    HeaderComponent,
    SideNavComponent,
  ],

  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  responsiveService = inject(ResponsiveService);

  collapsed = signal(false);
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

  constructor() {
    effect(
      () => {
        if (this.responsiveService.smallWidth()) {
          this.collapsed.set(true);
        } else {
          this.collapsed.set(false);
        }
      },
      { allowSignalWrites: true }
    );
  }

  toggleCollapsed() {
    this.collapsed.set(!this.collapsed());
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      lable: 'Dashboard',
      route: '/dashboard',
    },

    // Appointments menu
    {
      icon: 'event',
      lable: 'Appointments',
      route: '/appointments',
      subItems: [
        {
          icon: 'list',
          lable: 'View All',
          route: '/appointments',
        },
        {
          icon: 'calendar_today',
          lable: 'Calendar',
          route: '/appointments/calendar',
        },
        {
          icon: 'add',
          lable: 'Add Appointment',
          route: '/appointments/add',
        },
      ],
    },
    // Prescriptions menu
    {
      icon: 'description',
      lable: 'Prescriptions',
      route: '/prescriptions',
      subItems: [
        {
          icon: 'list',
          lable: 'View All',
          route: '/prescriptions',
        },
        {
          icon: 'add',
          lable: 'Add Prescription',
          route: '/prescriptions/add',
        },
      ],
    },
    
    {
      icon: 'access_time',
      lable: 'Availability',
      route: '/availability',
    },

    {
      icon: 'calendar_month',
      lable: 'Calendar',
      route: '/calendar',
    },

    {
      icon: 'group',
      lable: 'Users',
      route: '/users',
    },

    {
      icon: 'chat',
      lable: 'Chat',
      route: '/chat',
    },

    // Settings menu
    {
      icon: 'settings',
      lable: 'Settings',
      route: '/settings',
      subItems: [
        {
          icon: 'person',
          lable: 'Profile',
          route: '/settings/profile',
        },
        {
          icon: 'lock',
          lable: 'Change Password',
          route: '/settings/change-password',
        },
      ],
    },
  ]);
}
