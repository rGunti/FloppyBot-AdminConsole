import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapArrowCounterclockwise, bootstrapPencil, bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, filter, map, mergeMap, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

import { Quote } from '../../../api/entities';
import { QuoteApiService } from '../../../api/quote-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { DeleteQuoteDialogComponent } from '../../../dialogs/delete-quote-dialog/delete-quote-dialog.component';
import { EditQuoteDialogComponent } from '../../../dialogs/edit-quote-dialog/edit-quote-dialog.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { DialogService } from '../../../utils/dialog.service';

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
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [
    provideIcons({
      bootstrapTrash,
      bootstrapPencil,
      bootstrapArrowCounterclockwise,
    }),
  ],
})
export class ManageQuotesComponent implements AfterViewInit, OnDestroy {
  readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();
  private readonly channelService = inject(ChannelService);
  private readonly quoteApi = inject(QuoteApiService);
  private readonly dialog = inject(DialogService);

  readonly displayedColumns: string[] = ['quoteId', 'quote', 'quoteContext', 'createdBy', 'createdAt', 'actions'];
  readonly dataSource = new MatTableDataSource<Quote>([]);

  readonly selectedChannelId$ = this.channelService.selectedChannelId$;
  readonly dataSource$ = this.refresh$.pipe(
    mergeMap(() => this.channelService.selectedChannelId$),
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
    this.refresh$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEditTooltip(quote: Quote): string {
    return `Edit quote #${quote.quoteId}`;
  }

  getDeleteTooltip(quote: Quote): string {
    return `Delete quote #${quote.quoteId}`;
  }

  deleteQuote(quote: Quote): void {
    this.dialog
      .show(DeleteQuoteDialogComponent, quote)
      .pipe(
        filter((result) => !!result),
        switchMap(() =>
          this.channelService.selectedChannelId$.pipe(
            filter((i) => !!i),
            take(1),
          ),
        ),
        switchMap((channelId) => this.quoteApi.deleteQuote(channelId!, quote.quoteId)),
        tap(() => this.refresh$.next()),
      )
      .subscribe({
        next: () => {
          this.dialog.success('Quote deleted');
        },
      });
  }

  editQuote(quote: Quote): void {
    this.dialog
      .show<Quote>(EditQuoteDialogComponent, quote)
      .pipe(
        filter((result) => !!result),
        switchMap((updatedQuote) =>
          this.channelService.selectedChannelId$.pipe(
            filter((i) => !!i),
            take(1),
            map((channelId) => ({ updatedQuote, channelId })),
          ),
        ),
        switchMap(({ updatedQuote, channelId }) =>
          this.quoteApi.updateQuote(channelId!, {
            ...quote,
            ...updatedQuote!,
          }),
        ),
        tap(() => this.refresh$.next()),
      )
      .subscribe({
        next: () => {
          this.dialog.success('Quote updated');
        },
      });
  }
}
