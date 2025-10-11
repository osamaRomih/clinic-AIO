import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'DAL';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  constructor(public authService:AuthService,
    private router:Router
  ){
  }
  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
