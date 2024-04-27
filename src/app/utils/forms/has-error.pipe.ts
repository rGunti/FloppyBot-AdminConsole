import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'hasError',
  standalone: true,
})
export class HasErrorPipe implements PipeTransform {
  transform(value: AbstractControl, property: string): boolean {
    return value.get(property)?.invalid || false;
  }
}
