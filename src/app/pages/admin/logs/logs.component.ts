import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { debounceTime, startWith, switchMap, tap } from 'rxjs';

import { LogLevel, LogRecord } from '../../../api/entities';
import { LogApiService } from '../../../api/log-api.service';
import { LogLevelComponent } from '../../../components/log-level/log-level.component';

@Component({
  selector: 'fac-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    LogLevelComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatTooltip,
    MatSlideToggle,
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent {
  private readonly logApi = inject(LogApiService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    minLevel: this.fb.control<LogLevel>(LogLevel.Verbose),
    maxLevel: this.fb.control<LogLevel>(LogLevel.Fatal),
    maxRecords: this.fb.control<number>(1_000),
    hasException: this.fb.control<boolean>(false),
  });

  readonly logLevels = Object.values(LogLevel);

  readonly dataSource = new MatTableDataSource<LogRecord>([]);
  readonly displayedColumns = ['timestamp', 'level', 'context', 'renderedMessage'] as const;

  readonly logs$ = this.form.valueChanges.pipe(
    debounceTime(300),
    startWith(this.form.value),
    tap((formValue) => console.log('formValue', formValue)),
    switchMap((formValue) =>
      this.logApi.getLogs({
        minLevel: formValue.minLevel || LogLevel.Verbose,
        maxLevel: formValue.maxLevel || LogLevel.Fatal,
        maxRecords: formValue.maxRecords || 1_000,
        hasException: formValue.hasException || false,
      }),
    ),
    tap((logs) => (this.dataSource.data = logs)),
  );
}
