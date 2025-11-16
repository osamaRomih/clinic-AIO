import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILoginCreds } from '../../models/login-request';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatIconModule,MatInputModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() submit = new EventEmitter<ILoginCreds>();

  hide = signal(true);

  private fb = inject(FormBuilder);
  protected form!:FormGroup ;



  ngOnInit(){
    this.form = this.fb.group({
      emailOrUsername:['',[Validators.required]],
      password:['',[Validators.required]]
    });
  }
  
  onSubmit(){
    this.submit.emit(this.form.value);
  }

  toggleHide(event: MouseEvent){
    this.hide.update(hide => !hide);
    event.preventDefault();
    event.stopPropagation();
  }
}