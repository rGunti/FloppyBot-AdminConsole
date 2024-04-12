import { inject, Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ChannelService } from './channel.service';

@Pipe({
  name: 'channelAlias',
  standalone: true,
})
export class ChannelAliasPipe implements PipeTransform {
  private readonly channelService = inject(ChannelService);

  transform(channelId: string | null | undefined): Observable<string> {
    if (!channelId) {
      return of('');
    }
    return this.channelService.getChannelAlias(channelId);
  }
}
