import { inject, Pipe, PipeTransform } from '@angular/core';

import { Channel } from '../../api/entities';

import { ChannelService } from './channel.service';

@Pipe({
  name: 'channelId',
  standalone: true,
})
export class ChannelIdPipe implements PipeTransform {
  private readonly channelService = inject(ChannelService);

  transform(value: Channel | null | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    return this.channelService.getChannelId(value);
  }
}
