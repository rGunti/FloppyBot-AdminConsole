import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { bootstrapEye, bootstrapSignStopFill, bootstrapTrash, bootstrapX } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  finalize,
  map,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { LogLevel, LogRecord, LogRecordSearchParameters, LogStats } from '../../../api/entities';
import { LogApiService } from '../../../api/log-api.service';
import { ListFormControlComponent } from '../../../components/list-form-control/list-form-control.component';
import { LogLevelComponent } from '../../../components/log-level/log-level.component';
import { LogExceptionComponent } from '../../../dialogs/log-exception/log-exception.component';
import { LogInfoComponent } from '../../../dialogs/log-info/log-info.component';
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
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
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
    DatePipe,
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
      bootstrapX,
    }),
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        dateFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
      },
    },
    provideNativeDateAdapter(),
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
    minLevel: this.fb.control<number>(2), // Information
    maxLevel: this.fb.control<number>(LOG_LEVELS.length - 1), // Fatal
    minTime: this.fb.control<Date | null>(null),
    maxTime: this.fb.control<Date | null>(null),
    maxRecords: this.fb.control<number>(100),
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

  readonly filterParams$ = this.form.valueChanges.pipe(
    debounceTime(500),
    startWith(this.form.value),
    map(
      (formValue) =>
        ({
          minLevel: LOG_LEVELS[formValue.minLevel || 0],
          maxLevel: LOG_LEVELS[formValue.maxLevel || LOG_LEVELS.length - 1],
          minTime: formValue.minTime || null,
          maxTime: formValue.maxTime || null,
          maxRecords: formValue.maxRecords || 100,
          hasException: formValue.hasException || false,
          context: formValue.context || [],
          excludeContext: formValue.excludeContext || [],
          messageTemplate: formValue.messageTemplate || [],
          excludeMessageTemplate: formValue.excludeMessageTemplate || [],
          includeProperties: true,
        }) as LogRecordSearchParameters,
    ),
  );

  readonly dataSource = new MatTableDataSource<LogRecord>([]);
  readonly displayedColumns = ['timestamp', 'level', 'context', 'renderedMessage', '_functions'] as const;

  readonly loading$ = new BehaviorSubject<boolean>(false);
  readonly data$ = this.filterParams$.pipe(
    tap(() => {
      this.loading$.next(true);
    }),
    switchMap((filter) =>
      combineLatest([
        this.logApi.getLogs(filter).pipe(catchError(() => [])),
        this.logApi.getLogStats(filter).pipe(
          catchError(() => {
            return of<LogStats>({ totalCount: 0, oldestLogEntry: '', newestLogEntry: '' });
          }),
        ),
        this.logApi.getLogStats({}).pipe(
          catchError(() => {
            return of<LogStats>({ totalCount: 0, oldestLogEntry: '', newestLogEntry: '' });
          }),
        ),
      ]),
    ),
    tap(() => {
      this.loading$.next(false);
    }),
    finalize(() => {
      this.loading$.next(false);
    }),
    shareReplay(1),
  );
  readonly logs$ = this.data$.pipe(
    map(([logs]) => logs),
    tap((logs) => {
      this.dataSource.data = logs;
      this.dataSource.paginator = this.paginator;
    }),
  );
  readonly stats$ = this.data$.pipe(
    map(([, stats, unfilteredStats]) => ({ filtered: stats, unfiltered: unfilteredStats })),
  );
  readonly minTime$ = this.stats$.pipe(
    map((stats) => (stats.unfiltered.oldestLogEntry ? new Date(stats.unfiltered.oldestLogEntry) : null)),
  );
  readonly maxTime$ = this.stats$.pipe(
    map((stats) => (stats.unfiltered.newestLogEntry ? new Date(stats.unfiltered.newestLogEntry) : null)),
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

  clearTimeFilter(): void {
    this.form.get('minTime')!.setValue(null);
    this.form.get('maxTime')!.setValue(null);
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
