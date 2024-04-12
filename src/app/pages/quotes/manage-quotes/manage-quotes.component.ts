import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapPencil, bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { of, Subject, switchMap, takeUntil } from 'rxjs';

import { Quote } from '../../../api/entities';
import { QuoteApiService } from '../../../api/quote-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { ChannelService } from '../../../utils/channel/channel.service';

@Component({
  selector: 'fac-manage-quotes',
  standalone: true,
  templateUrl: './manage-quotes.component.html',
  styleUrl: './manage-quotes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ChannelSelectorComponent,
    MatIconModule,
    NgIconComponent,
    MatButtonModule,
    MatTooltipModule,
  ],
  providers: [
    provideIcons({
      bootstrapTrash,
      bootstrapPencil,
    }),
  ],
})
export class ManageQuotesComponent implements AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly channelService = inject(ChannelService);
  private readonly quoteApi = inject(QuoteApiService);

  readonly displayedColumns: string[] = ['quoteId', 'quote', 'quoteContext', 'createdBy', 'createdAt', 'actions'];
  readonly dataSource = new MatTableDataSource<Quote>([]);

  readonly dataSource$ = this.channelService.selectedChannelId$.pipe(
    takeUntil(this.destroy$),
    switchMap((channelId) => (channelId ? this.quoteApi.getQuotesForChannel(channelId) : of([]))),
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource$.subscribe((files) => {
      this.dataSource.data = files;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEditTooltip(quote: Quote): string {
    return `Edit quote #${quote.quoteId}`;
  }

  getDeleteTooltip(quote: Quote): string {
    return `Delete quote #${quote.quoteId}`;
  }
}
