import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommandApiService } from '../../../api/command-api.service';
import { ChannelService } from '../../../utils/channel/channel.service';
import { of, switchMap } from 'rxjs';
import { CommandListComponent } from '../../../components/command-list/command-list.component';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';

@Component({
  selector: 'fac-custom-commands',
  standalone: true,
  imports: [CommonModule, ChannelSelectorComponent, CommandListComponent],
  templateUrl: './custom-commands.component.html',
  styleUrl: './custom-commands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCommandsComponent {
  private readonly channelService = inject(ChannelService);
  private readonly commandApi = inject(CommandApiService);

  readonly commands$ = this.channelService.selectedChannelId$.pipe(
    switchMap((channelId) => (channelId ? this.commandApi.getCustomCommandsForChannel(channelId) : of([]))),
  );
}
