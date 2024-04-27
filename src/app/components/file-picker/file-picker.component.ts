import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapFolder2Open } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { filter } from 'rxjs';

import { FileHeader } from '../../api/entities';
import { DialogService } from '../../utils/dialog.service';
import { FilePickerDialogComponent, FilePickerDialogOptions } from '../file-picker-dialog/file-picker-dialog.component';

@Component({
  selector: 'fac-file-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgIconComponent,
    MatTooltipModule,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilePickerComponent),
      multi: true,
    },
    provideIcons({
      bootstrapFolder2Open,
    }),
  ],
  templateUrl: './file-picker.component.html',
  styleUrl: './file-picker.component.scss',
})
export class FilePickerComponent implements ControlValueAccessor {
  private readonly dialog = inject(DialogService);

  @Input() label = 'Choose file';
  @Input({ required: true }) restrictToChannel!: string;
  @Input() restrictToTypes: string[] = [];

  private _onChange: (_: unknown) => void = () => {};
  private _onTouch: (_: unknown) => void = () => {};

  disabled: boolean = false;
  value: string | null = null;

  openFileDialog(): void {
    this.dialog
      .show<FileHeader>(FilePickerDialogComponent, {
        restrictToChannel: this.restrictToChannel,
        restrictToTypes: this.restrictToTypes,
      } as FilePickerDialogOptions)
      .pipe(filter((result) => !!result))
      .subscribe((selectedFile) => {
        this.writeValue(selectedFile.id);
      });
  }

  writeValue(obj: string | null): void {
    this.value = obj;
    this._onChange(obj);
    this._onTouch(obj);
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
}
