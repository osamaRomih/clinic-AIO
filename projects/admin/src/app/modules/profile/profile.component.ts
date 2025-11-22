import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { AuthService, ProfileService, FieldErrorDirective, SnackbarService } from 'DAL';
import { Validators } from 'ngx-editor';
import { MatIcon } from "@angular/material/icon";
import { environment } from '../../../environments/environment.development';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatFormFieldModule, MatLabel, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule, MatIcon, FieldErrorDirective,TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);

  profileForm!:FormGroup;
  imageFile?: File;
  @ViewChild('preview') preview:any; 
  imageSrc:string | ArrayBuffer | null = null;
  defaultAvatar = 'assets/images/user.png';

  ngOnInit(): void {
    this.createForm();

    const user = this.authService.user();
    if(user?.imageUrl){
      this.imageSrc = `${environment.apiUrl}/${user.imageUrl}`;
    }else{
      this.imageSrc = this.defaultAvatar;
    }
  }

  createForm(){
    const user = this.authService.user();
    this.profileForm = this.fb.group({
      imageProfile:[user?.imageUrl||'',[Validators.required]],
      fullName:[user?.fullName||'',[Validators.required]],
      phoneNumber:[user?.phoneNumber||'',Validators.required],
      userName: [{ value: user?.userName || '', disabled: true }],
      email:[{value:user?.email || '',disabled:true}],
    })

  }
  onFileSelected(event:Event){
    const target = event.target as HTMLInputElement;
    if(target.files?.length){
      const file = target.files[0];
      this.imageFile = file;
      var reader  = new FileReader();

      reader.onload = () => {
        this.imageSrc = reader.result;
      };

      reader.readAsDataURL(file);

    }
  }

  removeImage(){
    this.imageSrc = null;
  }

  onSubmit(){
    if(this.profileForm.invalid){
      this.profileForm.markAllAsTouched();
      return;
    }
    
    const formData = new FormData();

    Object.keys(this.profileForm.value).forEach((key)=>{
      const formValue = this.profileForm.value[key];
      formData.append(key,formValue);
    })

    if(this.imageFile){
      formData.append('imageProfile',this.imageFile);
    }

    this.profileService.updateProfile(formData).subscribe({
      next:(res)=>{
        this.authService.getUserInfo().subscribe();
        this.snackbarService.success("Profile updated successfully");
      },
      error:()=>{
        this.snackbarService.success("Failed to updated profile");
      }
    })
    
  } 
}
