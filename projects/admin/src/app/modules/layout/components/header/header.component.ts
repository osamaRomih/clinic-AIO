import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'DAL';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatButtonModule,MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  @Output() menuToggled = new EventEmitter(false);
  user: string = 'Enea';
 logout(): void {
    console.log('Logged out');
  }

  constructor(public authService:AuthService){}

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
