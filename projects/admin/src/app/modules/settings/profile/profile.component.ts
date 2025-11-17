import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { AuthService, ProfileService } from 'DAL';
import { Validators } from 'ngx-editor';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatFormFieldModule, MatLabel,ReactiveFormsModule,MatInputModule,MatButtonModule,MatCardModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  constructor(private fb:FormBuilder,private profileSerive:ProfileService,private authService:AuthService){}

  profileForm!:FormGroup;
  imageFile?: File;
  @ViewChild('preview') preview:any; 
  imageSrc:string | ArrayBuffer | null = null;
  defaultAvatar = 'assets/images/profile-image.jpg';

  ngOnInit(): void {
    this.createForm();

    const user = this.authService.user();
    if(user?.imageUrl){
      this.imageSrc = `http://localhost:5069/${user.imageUrl}`;
    }else{
      this.imageSrc = this.defaultAvatar;
    }

  }

  createForm(){
    const user = this.authService.user();
    this.profileForm = this.fb.group({
      imageProfile:[user?.imageUrl||'',[Validators.required]],
      firstName:[user?.firstName||'',[Validators.required]],
      lastName:[user?.lastName||'',Validators.required],
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
    formData.append('firstName',this.profileForm.value.firstName);  
    formData.append('lastName',this.profileForm.value.lastName);  
    formData.append('phoneNumber',this.profileForm.value.phoneNumber); 
    
    if(this.imageFile){
      formData.append('imageProfile',this.imageFile);
    }


    this.profileSerive.updateProfile(formData).subscribe({
      next:(res)=>{
        this.authService.getUserInfo().subscribe();
      }
    })
    
  } 
}
