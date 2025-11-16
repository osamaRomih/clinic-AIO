import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav'
import { HeaderComponent, ResponsiveService } from 'DAL';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
    imports: [MatSidenavContainer, MatSidenav, MatSidenavContent, RouterOutlet, SidenavComponent,HeaderComponent],

  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  responsiveService = inject(ResponsiveService);

  collapsed = signal(false);
  sidenavWidth = computed(()=>this.collapsed() ? '65px':'250px')
  
  constructor() {
    effect(() => {
      if (this.responsiveService.smallWidth()) {
        this.collapsed.set(true);
      } else {
        this.collapsed.set(false);
      }
    },{allowSignalWrites:true});
  }

  toggleCollapsed(){
    console.log("collapsed")
    this.collapsed.set(!this.collapsed())
  }
  
  
}
