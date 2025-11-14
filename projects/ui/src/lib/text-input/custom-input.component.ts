import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnInit, Optional, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.css',
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'number' = 'text';
  @Input() placeholder = '';

  value!: string;
  disabled = false;

  onChange!: (value: string) => void;
  onTouched!: () => void;
  
  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl) {
      // register this component as the control value accessor
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  handleInput(event: Event) {
    const v = (event.target as HTMLInputElement).value;
    this.value = v;
    this.onChange(v);
  }
  
  get control() {
    return this.ngControl ? this.ngControl.control : null;
  }

  getFirstErrorMessage(): string | null {
    const ctrl = this.control;
    console.log(ctrl)

    if (!ctrl || !ctrl.errors) return null;
    console.log(ctrl)
    if (ctrl.hasError('required')) return `${this.label || 'Field'} is required`;
    if (ctrl.hasError('email')) return `Invalid email`;
    if (ctrl.hasError('minlength')) {
      const e = ctrl.getError('minlength');
      return `Minimum ${e?.requiredLength} characters`;
    }
    if (ctrl.hasError('maxlength')) {
      const e = ctrl.getError('maxlength');
      return `Maximum ${e?.requiredLength} characters`;
    }
    if (ctrl.hasError('pattern')) return 'Invalid format';
    return 'Invalid value';
  }
}
