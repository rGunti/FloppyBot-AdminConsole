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

function generateSortKey(channel: Channel): string {
  return `${channel.interface}/${channel.alias || channel.channel}`;
}

@Injectable({
  providedIn: 'root',
})
export class ChannelService implements OnDestroy {
  private readonly cacheTrigger$ = new BehaviorSubject<void>(undefined);
  private readonly selectedChannelIdSubject$ = new BehaviorSubject<string | undefined>(undefined);
  private readonly destroyed$ = new Subject<void>();
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApiService);

  private readonly selectedChannelIdSubscription = this.router.routerState.root.queryParams
    .pipe(
      takeUntil(this.destroyed$),
      map((params) => params['channel']),
      startWith(this.router.routerState.root.snapshot.queryParams['channel']),
      distinctUntilChanged(),
    )
    .subscribe((channelId) => this.selectedChannelIdSubject$.next(channelId));

  readonly selectedChannelId$: Observable<string | undefined> = this.selectedChannelIdSubject$.asObservable();
  readonly userReport$ = this.cacheTrigger$.pipe(
    switchMap(() => this.userApi.getMe()),
    shareReplay(1),
    takeUntil(this.destroyed$),
  );

  getSelectedChannelId(): string | undefined {
    return this.selectedChannelIdSubject$.getValue();
  }

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
      map((channels) => channels.sort((a, b) => generateSortKey(a).localeCompare(generateSortKey(b)))),
    );
  }

  getChannelAlias(channelId: string): Observable<string> {
    return this.userReport$.pipe(map((report) => report.channelAliases[channelId] || channelId));
  }

  /**
   * This method is expected to be used by tests only.
   */
  updateSelectedChannelId(channelId: string): void {
    this.selectedChannelIdSubject$.next(channelId);
  }
}
