import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, BusyService } from 'DAL';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatButtonModule,MatMenuModule,MatProgressBar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  @Output() menuToggled = new EventEmitter(false);
 logout(): void {
    this.authService.logout();
  }

  constructor(public authService:AuthService,public busyService:BusyService){}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const html = document.documentElement;

    if (this.isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');

    if(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)){
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

}
