import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, forwardRef, input, OnDestroy } from '@angular/core';
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
import { NgIcon } from '@ng-icons/core';
import { map, startWith, Subject, takeUntil, tap } from 'rxjs';

import { FilePickerComponent } from '../file-picker/file-picker.component';

interface VisualCommandResponseData {
  image: string;
  positionHorizontal: 'top' | 'center' | 'bottom';
  positionVertical: 'left' | 'center' | 'right';
  duration: number;
  text: string;
  font: string | null;
  color: string;
  borderColor: string;
  audio: string | null;
}

const DEFAULT_VALUES: VisualCommandResponseData = {
  image: '',
  positionHorizontal: 'center',
  positionVertical: 'center',
  duration: 5_000,
  text: '',
  color: 'green',
  borderColor: 'black',
  audio: null,
  font: null,
};

@Component({
  selector: 'fac-visual-command-response-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    NgIcon,
    FilePickerComponent,
    AsyncPipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VisualCommandResponseFormComponent),
      multi: true,
    },
  ],
  templateUrl: './visual-command-response-form.component.html',
  styleUrl: './visual-command-response-form.component.scss',
})
export class VisualCommandResponseFormComponent implements ControlValueAccessor, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private _onChange: (_: unknown) => void = () => {};
  private _onTouch: (_: unknown) => void = () => {};
  private _isDisabled: boolean = false;

  readonly channelId = input.required<string>();

  readonly form: FormGroup = new FormGroup({
    image: new FormControl<string>('', {
      validators: [Validators.required],
      updateOn: 'blur',
    }),
    duration: new FormControl<number>(5_000),
    positionHorizontal: new FormControl<VisualCommandResponseData['positionHorizontal']>('center'),
    positionVertical: new FormControl<VisualCommandResponseData['positionVertical']>('center'),
    text: new FormControl<string>(''),
    audio: new FormControl<string | null>(null),
    color: new FormControl<string | null>(null),
    borderColor: new FormControl<string | null>(null),
    font: new FormControl<string | null>(null),
  });

  readonly textPreview$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    tap((value) => console.log('VisualCommandResponseFormComponent', 'textPreview$', value)),
    map((value) => {
      const borderColor = value.borderColor ?? DEFAULT_VALUES.borderColor;
      return {
        text: value.text || 'Text Preview',
        cssStyle: {
          color: value.color ?? DEFAULT_VALUES.color,
          'font-family': value.font ?? "'Poppins', system-ui, -apple-system, sans-serif",
          'text-shadow': `-1px -1px 0 ${borderColor}, 1px -1px 0 ${borderColor}, -1px 1px 0 ${borderColor}, 1px 1px 0 ${borderColor}`,
        },
      };
    }),
  );

  constructor() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.changeValue(value);
    });
    this.form.setValue(DEFAULT_VALUES);
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  writeValue(obj: string | null | undefined): void {
    console.log('VisualCommandResponseFormComponent', 'writeValue', obj);
    if (obj) {
      const parsed = this.parseParameters(obj);
      console.log('VisualCommandResponseFormComponent', 'writeValue.parseParameters', parsed);
      this.form.patchValue({
        ...DEFAULT_VALUES,
        ...parsed,
      });
    } else {
      this.form.setValue(DEFAULT_VALUES);
    }
  }

  registerOnChange(fn: (_: unknown) => void): void {
    console.log('VisualCommandResponseFormComponent', 'registerOnChange', fn);
    this._onChange = fn;
  }

  registerOnTouched(fn: (_: unknown) => void): void {
    console.log('VisualCommandResponseFormComponent', 'registerOnTouched', fn);
    this._onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('VisualCommandResponseFormComponent', 'setDisabledState', isDisabled);
    this._isDisabled = isDisabled;
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private changeValue(obj: VisualCommandResponseData): void {
    console.log('VisualCommandResponseFormComponent', 'changeValue', obj);
    const output = this.getParameters(obj);
    if (this._onChange) {
      this._onChange(output);
    }
    if (this._onTouch) {
      this._onTouch(true);
    }
  }

  private parseParameters(input: string): VisualCommandResponseData {
    const lines = input.split('\n');
    const file = lines[0].substring('file://'.length);
    const data: VisualCommandResponseData = {
      ...DEFAULT_VALUES,
      image: file,
    };

    if (lines.length > 1) {
      return lines
        .splice(1)
        .map((line) => line.split('='))
        .flatMap(([key, value]) => {
          if (key === 'position') {
            const split = value.split('-');
            return [
              ['positionVertical', split[0]],
              ['positionHorizontal', split[1]],
            ];
          }

          return [[key, value]];
        })
        .map(([key, value]) => {
          if (key !== 'duration') {
            return [key, value];
          }

          let duration: number;
          if (value.toLowerCase().endsWith('ms')) {
            duration = parseInt(value.substring(0, value.length - 2), 10);
          } else if (value.toLowerCase().endsWith('s')) {
            duration = parseFloat(value.substring(0, value.length - 1)) * 1000;
          } else {
            duration = parseInt(value, 10);
          }
          return [key, duration];
        })
        .reduce((currentData, [key, value]) => {
          return {
            ...currentData,
            [key]: value,
          };
        }, data);
    } else {
      return data;
    }
  }

  private getParameters(params: VisualCommandResponseData): string {
    const ignoreProperties: (keyof VisualCommandResponseData)[] = ['image', 'positionHorizontal', 'positionVertical'];
    const properties = Object.keys(params)
      .map((k) => k as keyof VisualCommandResponseData)
      .filter((k) => !ignoreProperties.includes(k))
      .map((k) => [k, params[k]])
      .map(([key, value]) => `${key}=${value}`);

    return [
      `file://${params.image}`,
      `position=${params.positionVertical}-${params.positionHorizontal}`,
      ...properties,
    ].join('\n');
  }
}
