import { inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { Channel } from '../../api/entities';
import { UserApiService } from '../../api/user-api.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService implements OnDestroy {
  private readonly cacheTrigger$ = new BehaviorSubject<void>(undefined);
  private readonly destroyed$ = new Subject<void>();
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApiService);

  public readonly selectedChannelId$: Observable<string | undefined> = this.router.routerState.root.queryParams.pipe(
    takeUntil(this.destroyed$),
    map((params) => params['channel']),
    startWith(this.router.routerState.root.snapshot.queryParams['channel']),
    distinctUntilChanged(),
  );
  readonly userReport$ = this.cacheTrigger$.pipe(
    switchMap(() => this.userApi.getMe()),
    shareReplay(1),
    takeUntil(this.destroyed$),
  );

  invalidateCache(): void {
    console.log('ChannelService', 'Cache invalidation triggered');
    this.cacheTrigger$.next();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  parseChannelFromChannelId(channelId: string, alias?: string): Channel {
    const [type, id] = channelId.split('/');
    return { interface: type, channel: id, alias };
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

  getAccessibleChannels(): Observable<Channel[]> {
    return this.userReport$.pipe(
      map((report) =>
        report.ownerOf.map((channelId) => this.parseChannelFromChannelId(channelId, report.channelAliases[channelId])),
      ),
    );
  }

  getChannelAlias(channelId: string): Observable<string> {
    return this.userReport$.pipe(map((report) => report.channelAliases[channelId] || channelId));
  }
}
