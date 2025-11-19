import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILoginCreds } from '../../models/login-request';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ButtonLoadingDirective } from '../../directives/button-loading.directive';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatIconModule,MatInputModule,MatButtonModule,ButtonLoadingDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() formSubmit = new EventEmitter<ILoginCreds>();
  @Input() isLoading = false;
  @Input() validationErrors: string[] = [];

  hide = signal(true);

  private fb = inject(FormBuilder);
  protected form!:FormGroup ;



  ngOnInit(){
    this.form = this.fb.group({
      emailOrUsername:['',[Validators.required]],
      password:['',[Validators.required]]
    });
  }
  
  onSubmit(event?:Event){
    event?.stopPropagation();
    event?.preventDefault();
    this.formSubmit.emit(this.form.value);
  }

  toggleHide(event: MouseEvent){
    this.hide.update(hide => !hide);
    event.preventDefault();
    event.stopPropagation();
  }

}