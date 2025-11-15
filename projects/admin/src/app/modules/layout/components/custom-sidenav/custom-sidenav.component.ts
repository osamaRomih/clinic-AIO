import { Component, computed, inject, Input, Signal, signal } from '@angular/core';
import { MatList, MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from "@angular/router";
import { MenuItem } from '../MenuItem';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { AuthService } from 'DAL';


@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [MatListModule, CommonModule, MatIconModule, RouterModule,MenuItemComponent],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {

  authService = inject(AuthService);

  menuItems = signal<MenuItem[]>([
  {
    icon: 'home',
    lable: 'Home',
    route: '/home'
  },
  {
    icon: 'dashboard',
    lable: 'Dashboard',
    route: '/dashboard'
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
        route: '/appointments'
      },
      {
        icon: 'calendar_today',
        lable: 'Calendar',
        route: '/appointments/calendar'
      },
      {
        icon: 'add',
        lable: 'Add Appointment',
        route: '/appointments/add'
      }
    ]
  },

  {
    icon: 'access_time',
    lable: 'Availability',
    route: '/availability'
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
        route: '/prescriptions'
      },
      {
        icon: 'add',
        lable: 'Add Prescription',
        route: '/prescriptions/add'
      }
    ]
  },

  {
    icon: 'calendar_month',
    lable: 'Calendar',
    route: '/calendar'
  },

  {
    icon: 'group',
    lable: 'Users',
    route: '/users'
  },

  {
    icon: 'chat',
    lable: 'Chat',
    route: '/chat'
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
        route: '/settings/profile'
      },
      {
        icon: 'lock',
        lable: 'Change Password',
        route: '/settings/change-password'
      }
    ]
  }
]);



  sidenavCollapsed = signal(false)
  @Input() set collapsed(val:boolean){
    this.sidenavCollapsed.set(val);
  }

  profilePicSize = computed(()=> this.sidenavCollapsed() ? '32':'100')


}
