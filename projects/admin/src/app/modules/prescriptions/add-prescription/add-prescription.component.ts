import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatError, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButton, MatIconButton } from "@angular/material/button";
import { CommonModule } from '@angular/common';
import { PrescriptionService } from 'DAL';
@Component({
  selector: 'app-add-prescription',
  standalone: true,
    providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule,MatError,MatInput,MatIconButton,CommonModule, MatIconModule, NgxEditorComponent, NgxEditorMenuComponent,ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatLabel, MatButton],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.scss'
})
export class AddPrescriptionComponent implements OnInit, OnDestroy{
  html = '';
  editor!: Editor;

  constructor(private service:PrescriptionService,private fb:FormBuilder){
  }

  prescriptionForm!:FormGroup;
  medicationForm!: FormGroup;

  ngOnInit(): void {
    this.editor = new Editor();
    this.createForm();
    this.createMedicationForm();
  }

  createForm(){
    this.prescriptionForm = this.fb.group({
      patientId:[0,[Validators.required]],
      date:['',[Validators.required]],
      age:[1,[Validators.required,Validators.minLength(1),Validators.maxLength(100)]],
      diagnosis:['',[Validators.required]],
      nextVisit:['',[Validators.required]],
      notes:[''],
      medications: this.fb.array([])
    });
  }

  createMedicationForm() {
    this.medicationForm = this.fb.group({
      id:[0],
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: [0, Validators.required],
      days: [0, Validators.required],
      instructions: ['']
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get medications(): FormArray<FormGroup> {
    return this.prescriptionForm.get('medications') as FormArray<FormGroup>;
  }


  // Adds a new medication row
  addToTable() {
    if (this.medicationForm.valid) {
      this.medications.push(this.fb.group(this.medicationForm.value));
      this.medicationForm.reset();
    }


  }


  // Remove medication row
  removeMedication(index: number): void {
    this.medications.removeAt(index);
    // this.toastr.warning('Medication removed');
  }

  onSubmit(){
    const formValue = this.prescriptionForm.value;
    console.log('Prescription Submitted:', formValue);
    this.service.create(formValue).subscribe({
      next:(res)=>{
        console.log(res);
      }
    })
  }
}
