import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-login-google',
  standalone: true,
  imports: [GoogleSigninButtonModule],
  templateUrl: './login-google.component.html',
  styleUrl: './login-google.component.scss'
})
export class LoginGoogleComponent {
  private authService = inject(SocialAuthService);

  ngOnInit() {
    this.authService.authState.subscribe((user)=>{
      console.log(user);
    })
  }
}
