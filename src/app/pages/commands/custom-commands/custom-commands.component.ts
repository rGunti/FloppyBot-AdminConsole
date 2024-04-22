import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapArrowCounterclockwise } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, filter, map, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

import { CommandApiService } from '../../../api/command-api.service';
import { CommandInfo, CustomCommand } from '../../../api/entities';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { CommandListComponent } from '../../../components/command-list/command-list.component';
import { CustomCommandEditorDialogComponent } from '../../../dialogs/custom-command-editor-dialog/custom-command-editor-dialog.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { CommandService } from '../../../utils/commands/command.service';
import { DialogService } from '../../../utils/dialog.service';

@Component({
  selector: 'fac-custom-commands',
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
  templateUrl: './custom-commands.component.html',
  styleUrl: './custom-commands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCommandsComponent implements OnDestroy {
  readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();

  private readonly channelService = inject(ChannelService);
  private readonly commandApi = inject(CommandApiService);
  private readonly commandService = inject(CommandService);
  private readonly dialog = inject(DialogService);

  readonly selectedChannelId$ = this.channelService.selectedChannelId$;
  readonly commands$ = this.refresh$.pipe(
    switchMap(() => this.selectedChannelId$),
    switchMap((channelId) => (channelId ? this.commandService.getCustomCommands(channelId) : of([]))),
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editCommand($event: CommandInfo): void {
    this.selectedChannelId$
      .pipe(
        takeUntil(this.destroy$),
        filter((c) => !!c),
        take(1),
        switchMap((channelId) =>
          this.commandApi.getCustomCommandForChannel(channelId!, $event.name).pipe(
            switchMap((command) => this.dialog.show<CustomCommand>(CustomCommandEditorDialogComponent, command)),
            map((editedCommand) => ({ editedCommand, channelId })),
          ),
        ),
        filter(({ editedCommand }) => !!editedCommand),
        switchMap((response) => this.commandApi.updateCustomCommand(response.channelId!, response.editedCommand)),
        tap(() => this.refresh$.next()),
      )
      .subscribe(() => this.dialog.success('Command updated'));
  }
}
