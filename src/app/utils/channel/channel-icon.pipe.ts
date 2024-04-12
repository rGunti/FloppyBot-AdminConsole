import { inject, Pipe, PipeTransform } from '@angular/core';

import { Channel } from '../../api/entities';

import { ChannelService } from './channel.service';

@Pipe({
  name: 'channelIcon',
  standalone: true,
})
export class ChannelIconPipe implements PipeTransform {
  private readonly channelService = inject(ChannelService);

  transform(value: Channel | null | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    return this.channelService.getChannelIcon(value);
  }
}
