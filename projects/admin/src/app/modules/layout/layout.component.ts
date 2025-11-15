import { AfterViewInit, ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav'
import { MatMenuModule } from '@angular/material/menu'
import { AuthService, BusyService, Menu, ResponsiveService, ThemeService } from 'DAL';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CustomSidenavComponent } from "./components/custom-sidenav/custom-sidenav.component";

@Component({
  selector: 'app-layout',
  standalone: true,
    imports: [MatIconModule, MatToolbarModule,MatProgressBar, MatButtonModule, MatMenuModule, MatProgressBar, MatSidenavContainer, MatSidenav, MatSidenavContent, RouterOutlet, CustomSidenavComponent],

  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  authService = inject(AuthService);
  responsiveService = inject(ResponsiveService);
  busyService = inject(BusyService);
  themeService = inject(ThemeService);

  
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

  
  logout(){
    this.authService.logout()
  }

  setTheme(key: string) {
    // keep current dark state
    const dark = this.themeService.getCurrent().dark;
    this.themeService.apply(key, dark);
  }

  toggleDark() {
    const cur = this.themeService.getCurrent();
    this.themeService.apply(cur.theme, !cur.dark);
  }
  
  
}
