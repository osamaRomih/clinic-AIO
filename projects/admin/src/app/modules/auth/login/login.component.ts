import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, SnackbarService } from 'DAL';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  returnUrl:string = '/';
  loginForm!:FormGroup;
  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private snackBarService:SnackbarService,
    private activatedRoute:ActivatedRoute
  ){
    const url = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
    if(url)
      this.returnUrl = url;
  }

  ngOnInit(): void {
    this.createForm();
    
  }

  createForm(){
    this.loginForm = this.fb.group({
      emailOrUsername:['',[Validators.required]],
      password:['',[Validators.required]]
    });
  }

  login(){
    this.authService.login(this.loginForm.value).subscribe({
      next:(res)=>{
        localStorage.setItem('token',res.token);
        localStorage.setItem('refreshToken',res.refreshToken);
        this.authService.getUserInfo().subscribe(res=>{
          this.router.navigateByUrl(this.returnUrl);
          this.snackBarService.success('login successfully')
        });
        
      }
    })
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.preventDefault();
    event.stopPropagation();
  }
}
