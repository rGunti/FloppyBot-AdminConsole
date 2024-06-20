import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapArrowCounterclockwise } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, catchError, finalize, mergeMap, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { AuditLogRecord } from '../../../api/entities';
import { LogApiService } from '../../../api/log-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { ChannelAliasPipe } from '../../../utils/channel/channel-alias.pipe';

@Component({
  selector: 'fac-audit',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    ChannelSelectorComponent,
    MatProgressBarModule,
    MatButton,
    MatIcon,
    MatIconButton,
    NgIconComponent,
    MatTooltipModule,
    ChannelAliasPipe,
  ],
  providers: [
    provideIcons({
      bootstrapArrowCounterclockwise,
    }),
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        dateFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
      },
    },
  ],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
})
export class AuditComponent implements OnInit, OnDestroy {
  private readonly logApi = inject(LogApiService);
  private readonly channelService = inject(ChannelService);
  private readonly destroy$ = new Subject<void>();

  readonly dataSource = new MatTableDataSource<AuditLogRecord>();
  readonly displayedColumns = [
    'timestamp',
    'userIdentifier',
    // 'channelIdentifier',
    'objectType',
    'objectIdentifier',
    'action',
    'additionalData',
  ];

  readonly refresh$ = new BehaviorSubject<void>(undefined);
  readonly selectedChannelId$ = this.channelService.selectedChannelId$;

  readonly loading$ = new BehaviorSubject<boolean>(false);
  readonly data$ = this.refresh$.pipe(
    mergeMap(() => this.channelService.selectedChannelId$),
    takeUntil(this.destroy$),
    tap(() => this.loading$.next(true)),
    switchMap((channelId) => (channelId ? this.logApi.getAuditLogs(channelId).pipe(catchError(() => of([]))) : of([]))),
    tap(() => this.loading$.next(false)),
    tap((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }),
    finalize(() => this.loading$.next(false)),
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
