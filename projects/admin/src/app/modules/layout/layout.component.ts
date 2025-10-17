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
      color: '#ff7f0e',
    },
    {
      title: 'Availability',
      icon: 'home',
      link: '/availability',
      color: '#ff7f0e',
    },
    {
      title: 'Prescription',
      icon: 'home',
      link: '/prescription',
      color: '#ff7f0e',
    },
    {
      title: 'Settings',
      icon: 'bar_chart',
      color: '#ff7f0e',
      subMenu: [
        {
          title: 'Profile',
          icon: 'money',
          link: '/settings/profile',
          color: '#ff7f0e',
        },
        {
          title: 'Change password',
          icon: 'people',
          color: '#ff7f0e',
          link: '/settings/change-password',
        },
      ],
    },
  ]

}
