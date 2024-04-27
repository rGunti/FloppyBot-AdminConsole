import { inject, Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { combineLatest, map, Observable, of } from 'rxjs';

import { FormErrorService } from './form-error.service';

@Pipe({
  name: 'formError',
  standalone: true,
})
export class FormErrorPipe implements PipeTransform {
  private readonly formErrorService = inject(FormErrorService);

  transform(formControl: AbstractControl | null | undefined, property: string): Observable<string | null> {
    if (!formControl) {
      return of(null);
    }
    const field = formControl.get(property);
    if (!field) {
      return of(null);
    }
    return combineLatest([field.valueChanges, field.statusChanges]).pipe(
      map(() => this.formErrorService.getErrorMessage(field)),
    );
  }
}
