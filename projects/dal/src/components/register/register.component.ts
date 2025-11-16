import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { IRegisterCred } from '../../models/login-request';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatIconModule,MatInputModule,MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Output() submit = new EventEmitter<IRegisterCred>();

  hide = signal(true);

  private fb = inject(FormBuilder);
  protected form!:FormGroup ;



  ngOnInit(){
    this.form = this.fb.group({
      emailOrUsername:['',[Validators.required]],
      password:['',[Validators.required]],
      confirmPassword:['',[Validators.required,this.matchPassword.bind(this)]],
      phoneNumber:['',[Validators.required]],
      userName:['',[Validators.required]],
      firstName:['',[Validators.required]],
      lastName:['',[Validators.required]],
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

  private matchPassword(control:AbstractControl){
    if(!this.form)return null;
    return control.value === this.form.get('password')?.value ? null : {mismatch:true}
  }
}