import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { of, switchMap } from 'rxjs';

import { CommandApiService } from '../../../api/command-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { CommandListComponent } from '../../../components/command-list/command-list.component';
import { ChannelService } from '../../../utils/channel/channel.service';

@Component({
  selector: 'fac-built-in-commands',
  standalone: true,
  imports: [CommonModule, ChannelSelectorComponent, CommandListComponent, MatToolbarModule],
  templateUrl: './built-in-commands.component.html',
  styleUrl: './built-in-commands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuiltInCommandsComponent {
  private readonly channelService = inject(ChannelService);
  private readonly commandApi = inject(CommandApiService);

  readonly commands$ = this.channelService.selectedChannelId$.pipe(
    switchMap((channelId) => (channelId ? this.commandApi.getCommandsForChannel(channelId) : of([]))),
  );
}
