import { Pipe, PipeTransform, inject } from '@angular/core';
import { ChannelService } from './channel.service';
import { Channel } from '../../api/entities';

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
