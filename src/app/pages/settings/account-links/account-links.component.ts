import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { bootstrapArrowCounterclockwise, bootstrapTrash, bootstrapTwitch } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, filter, map, switchMap, take } from 'rxjs';

import { TwitchApiService } from '../../../api/twitch-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { DialogService } from '../../../utils/dialog.service';

@Component({
  selector: 'fac-account-links',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgIconComponent,
    ChannelSelectorComponent,
    MatToolbarModule,
  ],
  providers: [
    provideIcons({
      bootstrapTwitch,
      bootstrapArrowCounterclockwise,
      bootstrapTrash,
    }),
  ],
  templateUrl: './account-links.component.html',
  styleUrl: './account-links.component.scss',
})
export class AccountLinksComponent implements OnDestroy {
  private readonly channelService = inject(ChannelService);
  private readonly twitchApi = inject(TwitchApiService);
  private readonly dialog = inject(DialogService);

  readonly selectedChannelId$ = this.channelService.selectedChannelId$;
  readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly hasInvalidChannelSelected$ = this.selectedChannelId$.pipe(
    map((channelId) => !(channelId?.startsWith('Twitch/') || false)),
  );
  readonly selectedChannelName$ = this.selectedChannelId$.pipe(
    filter((channelId) => !!channelId && channelId.startsWith('Twitch/')),
    map((channelId) => channelId!.split('/')[1]),
  );

  readonly hasCredentialsForSelectedChannel$ = this.refresh$.pipe(
    switchMap(() => this.selectedChannelName$),
    switchMap((channelName) => this.twitchApi.hasCredentialsFor(channelName)),
  );

  ngOnDestroy(): void {
    this.refresh$.complete();
  }

  initiateTwitchConnection(): void {
    this.selectedChannelName$
      .pipe(
        take(1),
        switchMap((channel) => this.twitchApi.startNewSession(channel)),
      )
      .subscribe((start) => {
        const { loginUrl } = start;

        // Navigate to login URL
        window.location.href = loginUrl;
      });
  }

  revokeSession(): void {
    this.selectedChannelName$
      .pipe(
        take(1),
        switchMap((channel) =>
          this.dialog
            .ask(
              'Revoke Channel Credentials?',
              "Would you like to revoke FloppyBot's access to the connected account? FloppyBot will not be able to use your account to connect Twitch.",
              true,
            )
            .pipe(
              filter((r) => !!r),
              map(() => channel),
            ),
        ),
        switchMap((channel) => this.twitchApi.revokeSession(channel)),
      )
      .subscribe(() => {
        this.refresh$.next();
      });
  }
}
