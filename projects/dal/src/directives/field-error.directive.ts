import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';

@Directive({
  selector: '[libFieldError]',
  standalone: true,
})
export class FieldErrorDirective implements AfterViewInit {
  formField = inject(MatFormField);
  errorElement = inject(ElementRef);

  ngAfterViewInit(): void {
    const control = this.formField._formFieldControl.ngControl?.control;

    if (!control) {
      throw new Error('FieldErrorDirective must be used within a mat form field with a form control attached');
    }

    control.events.subscribe(() => {
      const showErrors = control.errors && (control.touched || control.dirty);
      if (showErrors) {
        const firstError = Object.keys(control.errors)[0];
        const firstErrorValue = control.errors[firstError];
        const errorMessage = this.getErrorMessage(firstError, firstErrorValue);
        this.errorElement.nativeElement.textContent = errorMessage;
      } else {
        this.errorElement.nativeElement.textContent = '';
      }
    });
  }

  getErrorMessage(error: string, errorValue: any): string {
    const errorMessages: { [key: string]: string | ((errorValue: any) => string) } = {
      passwordMismatch: 'Password and repeat password do not match',
      passwordPattern:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit and one special character.',
      phonePattern: 'Phone number must be 11 digits and start with 011, 010, 012, or 015.',
      required: 'this field is required',
      email: 'Please enter a valid email address',
      minlength: (errorValue) => `Must be at least ${errorValue.requiredLength} characters`,
      maxlength: (errorValue) => `Must be less than ${errorValue.requiredLength} characters`,
      min: (errorValue) => `Must be at least ${errorValue.min}`,
      max: (errorValue) => `Must be less than ${errorValue.max}`,
    };

    const errorMessage = errorMessages[error];

    if (typeof errorMessage === 'function') return errorMessage(errorValue);

    return errorMessage || '';
  }
}
