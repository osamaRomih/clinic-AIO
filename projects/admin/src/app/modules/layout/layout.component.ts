import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'

import { MatMenuItem, MatMenuModule } from '@angular/material/menu'
import { Menu } from 'DAL';
import { MenuItemComponent } from "./components/menu-item/menu-item.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MatDrawerContainer, MatDrawer, MatMenuModule, MatDrawerContent, MenuItemComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  opened = true;
  toggle(){
    this.opened = !this.opened;
  }

  menu:Menu = [
     {
      title: 'Home',
      icon: 'home',
      link: '/home',
      color: '#007DFC',
    },
    {
      title: 'Availability',
      icon: 'home',
      link: '/availability',
      color: '#007dfc',
    },
    {
      title: 'Appointments',
      icon: 'schedule',
      color: '#007dfc',
      subMenu: [
        {
          title: 'Appointment Calender',
          icon: '',
          link: '/appointment/appointment-calender',
          color: '#007dfc',
        },
        {
          title: 'View Appointment',
          icon: '',
          color: '#007dfc',
          link: '/appointments',
        },
        {
          title:'Book Appointment',
          icon:'',
          color:'#007DFC',
          link:'/appointment/bookAppointment'
        },
        {
          title:'Update Appointment',
          icon:'',
          color:'#007DFC',
          link:'/appointment/updateAppointment'
        }
      ],
    },
    {
      title:'Chat',
      icon:'chat',
      color:'#007DFC',
      link:'/chat'
    },
    {
      title: 'Prescriptions',
      icon: 'home',
      link: '/prescription',
      color: '#007dfc',
    },
    {
      title: 'Users',
      icon: 'home',
      link: '/users',
      color: '#007dfc',
    },
    {
      title: 'Settings',
      icon: 'bar_chart',
      color: '#007dfc',
      link: '/settings'
    },
    {
      title: 'Calander',
      icon: 'bar_chart',
      color: '#007dfc',
      link: '/calander'
    },
  ]

}
