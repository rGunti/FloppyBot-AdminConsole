import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { StreamSourceUrlComponent } from '../../../components/stream-source-url/stream-source-url.component';
import { ChannelService } from '../../../utils/channel/channel.service';

@Component({
  selector: 'fac-show-url',
  standalone: true,
  imports: [CommonModule, StreamSourceUrlComponent, ChannelSelectorComponent, MatCardModule],
  templateUrl: './show-url.component.html',
  styleUrl: './show-url.component.scss',
})
export class ShowUrlComponent {
  private readonly channelService = inject(ChannelService);

  readonly selectedChannel$ = this.channelService.selectedChannelId$;
}
