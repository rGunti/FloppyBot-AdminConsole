import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'fac-list-form-control',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, MatTooltipModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListFormControlComponent),
      multi: true,
    },
  ],
  templateUrl: './list-form-control.component.html',
  styleUrl: './list-form-control.component.scss',
})
export class ListFormControlComponent implements ControlValueAccessor {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private _onChange: (_: unknown) => void = () => {};
  private _onTouch: (_: unknown) => void = () => {};

  @Input() label = '';
  @Input() addPlaceholder = 'Add item …';

  disabled: boolean = false;
  items: string[] = [];

  writeValue(obj: string[]): void {
    this.items = obj || [];
  }

  registerOnChange(fn: (_: unknown) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: (_: unknown) => void): void {
    this._onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  addItem(event: MatChipInputEvent): void {
    const item = (event.value || '').trim();
    if (item) {
      this.items.push(item);
      this._onChange(this.items);
      this._onTouch(this.items);
    }

    event.chipInput!.clear();
  }

  removeItem(item: string): void {
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.items.splice(index, 1);
      this._onChange(this.items);
      this._onTouch(this.items);
    }
  }

  getTooltip(item: string): string {
    return `Remove "${item}"`;
  }
}
