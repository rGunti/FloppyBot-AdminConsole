import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { bootstrapChatDots, bootstrapMusicNote } from '@ng-icons/bootstrap-icons';
import { provideIcons } from '@ng-icons/core';
import { Subject, takeUntil } from 'rxjs';

import { CommandResponse, CommandResponseType } from '../../api/entities';
import { FormErrorPipe } from '../../utils/forms/form-error.pipe';
import { FilePickerComponent } from '../file-picker/file-picker.component';

@Component({
  selector: 'fac-custom-command-response-form',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCommandResponseFormComponent),
      multi: true,
    },
    provideIcons({
      bootstrapChatDots,
      bootstrapMusicNote,
    }),
  ],
  templateUrl: './custom-command-response-form.component.html',
  styleUrl: './custom-command-response-form.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FilePickerComponent,
    FormErrorPipe,
  ],
})
export class CustomCommandResponseFormComponent implements ControlValueAccessor, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private _onChange: (_: unknown) => void = () => {};
  private _onTouch: (_: unknown) => void = () => {};
  private _isDisabled: boolean = false;

  @Input({ required: true }) channelId!: string | null;

  readonly form: FormGroup = new FormGroup({
    type: new FormControl<CommandResponseType>('Text', {
      validators: [Validators.required],
      updateOn: 'blur',
    }),
    content: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(500)],
      updateOn: 'blur',
    }),
    auxiliaryContent: new FormControl<string | null | undefined>(null, {
      validators: [Validators.maxLength(400)],
      updateOn: 'blur',
    }),
    sendAsReply: new FormControl<boolean>(true, {
      validators: [Validators.required],
      updateOn: 'blur',
    }),
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.changeValue(value);
    });
  }

  public get isDisabled(): boolean {
    return this._isDisabled;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private changeValue(obj: CommandResponse): void {
    console.log('CustomCommandResponseFormComponent', 'changeValue', obj);
    this._onChange(obj);
    this._onTouch(true);
  }

  writeValue(obj: CommandResponse): void {
    console.log('CustomCommandResponseFormComponent', 'writeValue', obj);
    if (obj) {
      this.form.patchValue(obj);
    }
  }

  registerOnChange(fn: (_: unknown) => void): void {
    console.log('CustomCommandResponseFormComponent', 'registerOnChange', fn);
    this._onChange = fn;
  }

  registerOnTouched(fn: (_: unknown) => void): void {
    console.log('CustomCommandResponseFormComponent', 'registerOnTouched', fn);
    this._onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('CustomCommandResponseFormComponent', 'setDisabledState', isDisabled);
    this._isDisabled = isDisabled;
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
}
