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
      icon: 'home',
      link: '/appointments',
      color: '#007dfc',
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
  ]

}
