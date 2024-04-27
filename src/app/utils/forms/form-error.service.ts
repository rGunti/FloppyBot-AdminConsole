import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { CustomCommandValidators } from './custom-commands';

@Injectable({
  providedIn: 'root',
})
export class FormErrorService {
  getErrorMessage(formControl: AbstractControl | null | undefined): string | null {
    if (!formControl || !formControl.errors) {
      return null;
    }

    const errors = formControl.errors;
    console.log('FormErrorService', 'getErrorMessage', errors);

    if (CustomCommandValidators.errorKeys.some((key) => errors[key])) {
      return CustomCommandValidators.getErrorMessage(formControl);
    }

    if (errors['minlength']) {
      const { requiredLength, actualLength } = errors['minlength'];
      return `Minimum length is ${requiredLength} (current: ${actualLength})`;
    }

    if (errors['maxlength']) {
      const { requiredLength, actualLength } = errors['maxlength'];
      return `Maximum length is ${requiredLength} (current: ${actualLength})`;
    }

    if (errors['required']) {
      return 'This field is required';
    }

    return null;
  }
}
