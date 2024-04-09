import { Pipe, PipeTransform, inject } from '@angular/core';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entities';

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
