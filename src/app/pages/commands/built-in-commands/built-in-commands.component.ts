import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { of, switchMap } from 'rxjs';
import { ChannelService } from '../../../utils/channel/channel.service';
import { CommandApiService } from '../../../api/command-api.service';
import { CommandListComponent } from '../../../components/command-list/command-list.component';

@Component({
  selector: 'fac-built-in-commands',
  standalone: true,
  imports: [CommonModule, ChannelSelectorComponent, CommandListComponent],
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
