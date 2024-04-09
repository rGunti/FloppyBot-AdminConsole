import { Pipe, PipeTransform, inject } from '@angular/core';
import { Channel } from './channel.entities';
import { ChannelService } from './channel.service';

@Pipe({
  name: 'channelName',
  standalone: true,
})
export class ChannelNamePipe implements PipeTransform {
  private readonly channelService = inject(ChannelService);

  transform(value: Channel | null | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    if (value.alias) {
      return value.alias;
    }

    return this.channelService.getChannelId(value);
  }
}
