import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { bootstrapEye, bootstrapSignStopFill, bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  map,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { LogLevel, LogRecord } from '../../../api/entities';
import { LogApiService } from '../../../api/log-api.service';
import { ListFormControlComponent } from '../../../components/list-form-control/list-form-control.component';
import { LogLevelComponent } from '../../../components/log-level/log-level.component';
import { LogExceptionComponent } from '../../../dialogs/log-exception/log-exception.component';
import { LogInfoComponent } from '../../../dialogs/log-info/log-info.component';
import { DateFormatPipe } from '../../../utils/date-format.pipe';
import { DialogService } from '../../../utils/dialog.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';

const LOG_LEVELS: readonly LogLevel[] = [
  LogLevel.Verbose,
  LogLevel.Debug,
  LogLevel.Information,
  LogLevel.Warning,
  LogLevel.Error,
  LogLevel.Fatal,
];

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
    MatProgressSpinner,
    MatProgressBar,
    MatMenuModule,
    MatButton,
    MatSliderModule,
    MatExpansionModule,
    MatPaginator,
    DateFormatPipe,
    ListFormControlComponent,
    MatIconButton,
    MatIcon,
    NgIconComponent,
    TruncatePipe,
  ],
  providers: [
    provideIcons({
      bootstrapTrash,
      bootstrapEye,
      bootstrapSignStopFill,
    }),
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent implements OnInit, OnDestroy {
  private readonly logApi = inject(LogApiService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(DialogService);

  private readonly destroy$ = new Subject<void>();

  readonly logLevels = LOG_LEVELS;

  readonly form = this.fb.group({
    minLevel: this.fb.control<number>(0),
    maxLevel: this.fb.control<number>(LOG_LEVELS.length - 1),
    maxRecords: this.fb.control<number>(1_000),
    hasException: this.fb.control<boolean>(false),
    context: this.fb.control<string[]>([]),
    excludeContext: this.fb.control<string[]>([]),
    messageTemplate: this.fb.control<string[]>([]),
    excludeMessageTemplate: this.fb.control<string[]>([]),
  });
  readonly contextFilterCount$ = this.form.get('context')!.valueChanges.pipe(
    startWith(this.form.get('context')!.value),
    map((context) => context?.length || 0),
  );
  readonly excludeContextFilterCount$ = this.form.get('excludeContext')!.valueChanges.pipe(
    startWith(this.form.get('excludeContext')!.value),
    map((excludeContext) => excludeContext?.length || 0),
  );
  readonly messageTemplateFilterCount$ = this.form.get('messageTemplate')!.valueChanges.pipe(
    startWith(this.form.get('messageTemplate')!.value),
    map((templates) => templates?.length || 0),
  );
  readonly excludeMessageTemplateFilterCount$ = this.form.get('excludeMessageTemplate')!.valueChanges.pipe(
    startWith(this.form.get('excludeMessageTemplate')!.value),
    map((excludeTemplates) => excludeTemplates?.length || 0),
  );

  readonly dataSource = new MatTableDataSource<LogRecord>([]);
  readonly displayedColumns = ['timestamp', 'level', 'context', 'renderedMessage', '_functions'] as const;

  readonly loading$ = new BehaviorSubject<boolean>(false);
  readonly logs$ = this.form.valueChanges.pipe(
    debounceTime(500),
    startWith(this.form.value),
    tap((formValue) => {
      console.log('formValue', formValue);
      this.loading$.next(true);
    }),
    switchMap((formValue) =>
      this.logApi
        .getLogs({
          minLevel: LOG_LEVELS[formValue.minLevel || 0],
          maxLevel: LOG_LEVELS[formValue.maxLevel || LOG_LEVELS.length - 1],
          maxRecords: formValue.maxRecords || 1_000,
          hasException: formValue.hasException || false,
          context: formValue.context || [],
          excludeContext: formValue.excludeContext || [],
          messageTemplate: formValue.messageTemplate || [],
          excludeMessageTemplate: formValue.excludeMessageTemplate || [],
          includeProperties: true,
        })
        .pipe(
          catchError(() => {
            this.loading$.next(false);
            return [];
          }),
        ),
    ),
    tap((logs) => {
      this.dataSource.data = logs;
      this.dataSource.paginator = this.paginator;
      this.loading$.next(false);
    }),
    shareReplay(1),
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.logs$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addContextFilter(context: string, filter: 'include' | 'exclude'): void {
    this.updateIncludeExcludeFilter(context, filter, 'context', 'excludeContext');
  }

  addMessageTemplateFilter(template: string, filter: 'include' | 'exclude'): void {
    this.updateIncludeExcludeFilter(template, filter, 'messageTemplate', 'excludeMessageTemplate');
  }

  clearContextFilters(): void {
    this.form.get('context')!.setValue([]);
    this.form.get('excludeContext')!.setValue([]);
  }

  clearMessageTemplateFilters(): void {
    this.form.get('messageTemplate')!.setValue([]);
    this.form.get('excludeMessageTemplate')!.setValue([]);
  }

  formatLogLevel(level: number): string {
    return LOG_LEVELS[level];
  }

  showEntry(log: LogRecord): void {
    this.dialog.show(LogInfoComponent, log);
  }

  showException(log: LogRecord): void {
    this.dialog.show(LogExceptionComponent, log);
  }

  private updateIncludeExcludeFilter(
    itemValue: string,
    filter: 'include' | 'exclude',
    includeFilterControl: string,
    excludeFilterControl: string,
  ): void {
    const filterControl = this.form.get(filter === 'include' ? includeFilterControl : excludeFilterControl);
    const oppositeFilterControl = this.form.get(filter === 'include' ? excludeFilterControl : includeFilterControl);
    if (!filterControl || !oppositeFilterControl) {
      return;
    }

    const filterValue: string[] = filterControl.value;
    const oppositeFilterValue: string[] = oppositeFilterControl.value;
    if (!filterValue || !oppositeFilterValue) {
      return;
    }

    if (filterValue.includes(itemValue)) {
      return;
    }

    if (oppositeFilterValue.includes(itemValue)) {
      oppositeFilterControl.setValue(oppositeFilterValue.filter((t: string) => t !== itemValue));
    }

    filterControl.setValue([...filterValue, itemValue]);
  }
}
