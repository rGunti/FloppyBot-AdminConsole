import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { MatIconModule } from '@angular/material/icon';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  bootstrapBan,
  bootstrapCheckCircle,
  bootstrapDiscord,
  bootstrapPencil,
  bootstrapSearch,
  bootstrapShieldFill,
  bootstrapShieldLock,
  bootstrapShieldShaded,
  bootstrapTrash,
  bootstrapTwitch,
  bootstrapXCircle,
} from '@ng-icons/bootstrap-icons';
import { Subject, of, switchMap, takeUntil } from 'rxjs';
import { ChannelService } from '../../../utils/channel/channel.service';
import { CommandApiService } from '../../../api/command-api.service';
import { CommandInfo } from '../../../api/entities';
import { CommandRestrictionsComponent } from '../../../components/command-restrictions/command-restrictions.component';
import { ListPipe } from '../../../utils/list.pipe';

@Component({
  selector: 'fac-built-in-commands',
  standalone: true,
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
    CommandRestrictionsComponent,
    ListPipe,
  ],
  providers: [
    provideIcons({
      bootstrapSearch,
      bootstrapPencil,
      bootstrapTrash,
      bootstrapDiscord,
      bootstrapTwitch,
      bootstrapShieldLock,
      bootstrapShieldShaded,
      bootstrapShieldFill,
      bootstrapCheckCircle,
      bootstrapXCircle,
      bootstrapBan,
    }),
  ],
  templateUrl: './built-in-commands.component.html',
  styleUrl: './built-in-commands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuiltInCommandsComponent implements AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly channelService = inject(ChannelService);
  private readonly commandApi = inject(CommandApiService);

  readonly displayedColumns: string[] = ['enabled', 'name', 'restrictions', 'actions'];
  readonly dataSource = new MatTableDataSource<CommandInfo>([]);

  readonly dataSource$ = this.channelService.selectedChannelId$.pipe(
    takeUntil(this.destroy$),
    switchMap((channelId) => (channelId ? this.commandApi.getCommandsForChannel(channelId) : of([]))),
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

  getDetailTooltip(command: CommandInfo): string {
    return `Show more about ${command.name}`;
  }

  getEditTooltip(command: CommandInfo): string {
    return `Edit ${command.name}`;
  }

  getDisableTooltip(command: CommandInfo): string {
    return `Disable ${command.name}`;
  }
}
