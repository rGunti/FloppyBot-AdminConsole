import { Injectable, OnDestroy, inject } from '@angular/core';
import { Channel } from '../../api/entities';
import { Observable, Subject, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChannelService implements OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  private readonly router = inject(Router);

  public readonly selectedChannelId$: Observable<string | undefined> = this.router.routerState.root.queryParams.pipe(
    takeUntil(this.destroyed$),
    map((params) => params['channel']),
    startWith(this.router.routerState.root.snapshot.queryParams['channel']),
    distinctUntilChanged(),
  );

  constructor() {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  parseChannelFromChannelId(channelId: string): Channel {
    const [type, id] = channelId.split('/');
    return { interface: type, channel: id };
  }

  getChannelIcon(channel: Channel): string {
    switch (channel.interface) {
      case 'Twitch':
        return 'bootstrapTwitch';
      case 'Discord':
        return 'bootstrapDiscord';
      default:
        return 'bootstrapQuestion';
    }
  }

  getChannelId(channel: Channel): string {
    return `${channel.interface}/${channel.channel}`;
  }
}
