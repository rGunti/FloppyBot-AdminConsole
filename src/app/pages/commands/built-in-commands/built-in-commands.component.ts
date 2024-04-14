import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BehaviorSubject, filter, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

import { CommandApiService } from '../../../api/command-api.service';
import { CommandInfo } from '../../../api/entities';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { CommandListComponent } from '../../../components/command-list/command-list.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { CommandService } from '../../../utils/commands/command.service';
import { DialogService } from '../../../utils/dialog.service';

@Component({
  selector: 'fac-built-in-commands',
  standalone: true,
  imports: [CommonModule, ChannelSelectorComponent, CommandListComponent, MatToolbarModule],
  templateUrl: './built-in-commands.component.html',
  styleUrl: './built-in-commands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuiltInCommandsComponent implements OnDestroy {
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();

  private readonly channelService = inject(ChannelService);
  private readonly commandService = inject(CommandService);
  private readonly commandApi = inject(CommandApiService);
  private readonly dialog = inject(DialogService);

  readonly commands$ = this.refresh$.pipe(
    takeUntil(this.destroy$),
    switchMap(() => this.channelService.selectedChannelId$),
    switchMap((channelId) => (channelId ? this.commandService.getBuiltInCommands(channelId) : of([]))),
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  disableCommand(command: CommandInfo): void {
    this.channelService.selectedChannelId$
      .pipe(
        filter((channelId) => !!channelId),
        take(1),
        switchMap((channelId) => this.commandApi.disableCommandForChannel(channelId!, command.name, !command.disabled)),
        tap(() =>
          this.dialog.success(`Command "${command.name}" has been ${command.disabled ? 'enabled' : 'disabled'}`),
        ),
      )
      .subscribe(() => this.refresh$.next());
  }
}
