import { Pipe, PipeTransform, inject } from '@angular/core';
import { ChannelService } from './channel.service';
import { Channel } from '../../api/entities';

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
