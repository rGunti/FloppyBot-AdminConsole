import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapArrowCounterclockwise, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, catchError, of, Subject, switchMap } from 'rxjs';

import { ChannelReward } from '../../../api/entities';
import { TwitchApiService } from '../../../api/twitch-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { CommandListComponent } from '../../../components/command-list/command-list.component';
import { TwitchRewardsListComponent } from '../../../components/twitch-rewards-list/twitch-rewards-list.component';
import { ChannelService } from '../../../utils/channel/channel.service';

@Component({
  selector: 'fac-channel-rewards',
  imports: [
    CommonModule,
    ChannelSelectorComponent,
    CommandListComponent,
    MatToolbarModule,
    MatIconModule,
    NgIconComponent,
    MatButtonModule,
    MatTooltipModule,
    TwitchRewardsListComponent,
  ],
  providers: [
    provideIcons({
      bootstrapArrowCounterclockwise,
      bootstrapPlus,
    }),
  ],
  templateUrl: './channel-rewards.component.html',
  styleUrl: './channel-rewards.component.scss',
})
export class ChannelRewardsComponent implements OnDestroy {
  readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();

  private readonly channelService = inject(ChannelService);
  private readonly twitchApi = inject(TwitchApiService);
  // private readonly commandApi = inject(CommandApiService);
  // private readonly commandService = inject(CommandService);
  // private readonly dialog = inject(DialogService);

  readonly selectedChannelId$ = this.channelService.selectedChannelId$;
  readonly rewards$ = this.refresh$.pipe(
    switchMap(() => this.selectedChannelId$),
    switchMap((channelId) =>
      channelId && channelId.split('/')[0] === 'Twitch'
        ? this.twitchApi.getRewards(channelId.split('/')[1]).pipe(catchError(() => of([] as ChannelReward[])))
        : of([]),
    ),
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
