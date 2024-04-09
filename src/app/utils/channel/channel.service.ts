import { Injectable } from '@angular/core';
import { Channel } from './channel.entities';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  parseChannelFromChannelId(channelId: string): Channel {
    const [type, id] = channelId.split('/');
    return { type, id };
  }

  getChannelIcon(channel: Channel): string {
    switch (channel.type) {
      case 'Twitch':
        return 'bootstrapTwitch';
      case 'Discord':
        return 'bootstrapDiscord';
      default:
        return 'bootstrapQuestion';
    }
  }

  getChannelId(channel: Channel): string {
    return `${channel.type}/${channel.id}`;
  }
}
