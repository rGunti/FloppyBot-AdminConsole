import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapArrowCounterclockwise } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

import { CommandApiService } from '../../../api/command-api.service';
import { CommandInfo } from '../../../api/entities';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { CommandListComponent } from '../../../components/command-list/command-list.component';
import { AboutCommandDialogComponent } from '../../../dialogs/about-command-dialog/about-command-dialog.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { CommandService } from '../../../utils/commands/command.service';
import { DialogService } from '../../../utils/dialog.service';

@Component({
  selector: 'fac-built-in-commands',
  standalone: true,
  imports: [
    CommonModule,
    ChannelSelectorComponent,
    CommandListComponent,
    MatToolbarModule,
    MatIconModule,
    NgIconComponent,
    MatButtonModule,
    MatTooltipModule,
  ],
  providers: [
    provideIcons({
      bootstrapArrowCounterclockwise,
    }),
  ],
  templateUrl: './built-in-commands.component.html',
  styleUrl: './built-in-commands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuiltInCommandsComponent implements OnDestroy {
  readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();

  private readonly channelService = inject(ChannelService);
  private readonly commandService = inject(CommandService);
  private readonly commandApi = inject(CommandApiService);
  private readonly dialog = inject(DialogService);

  readonly selectedChannelId$ = this.channelService.selectedChannelId$;
  readonly commands$ = this.refresh$.pipe(
    switchMap(() => this.channelService.selectedChannelId$),
    takeUntil(this.destroy$),
    switchMap((channelId) => (channelId ? this.commandService.getBuiltInCommands(channelId) : of([]))),
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  disableCommand(command: CommandInfo): void {
    console.log('Disabling command:', command);
    this.channelService.selectedChannelId$
      .pipe(
        take(1),
        switchMap((channelId) => this.commandApi.disableCommandForChannel(channelId!, command.name, !command.disabled)),
        tap(() =>
          this.dialog.success(`Command "${command.name}" has been ${command.disabled ? 'enabled' : 'disabled'}`),
        ),
      )
      .subscribe(() => this.refresh$.next());
  }

  showCommandDetails(command: CommandInfo): void {
    console.log('Showing command', command);
    this.channelService.selectedChannelId$
      .pipe(
        take(1),
        switchMap((channelId) => this.dialog.show(AboutCommandDialogComponent, { command, channelId })),
      )
      .subscribe();
  }
}
