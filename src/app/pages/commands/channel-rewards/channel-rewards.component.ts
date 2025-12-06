import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapArrowCounterclockwise, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, catchError, filter, map, of, Subject, switchMap, take, tap } from 'rxjs';

import { ChannelReward, CommandInfo, TwitchReward } from '../../../api/entities';
import { TwitchApiService } from '../../../api/twitch-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { TwitchRewardsListComponent } from '../../../components/twitch-rewards-list/twitch-rewards-list.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { CommandService } from '../../../utils/commands/command.service';
import { DialogService } from '../../../utils/dialog.service';

@Component({
  selector: 'fac-channel-rewards',
  imports: [
    CommonModule,
    ChannelSelectorComponent,
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
  private readonly commandService = inject(CommandService);
  private readonly dialog = inject(DialogService);

  readonly selectedChannelId$ = this.channelService.selectedChannelId$;
  readonly rewards$ = this.refresh$.pipe(
    switchMap(() => this.selectedChannelId$),
    switchMap((channelId) =>
      channelId && channelId.split('/')[0] === 'Twitch'
        ? this.twitchApi.getRewards(channelId.split('/')[1]).pipe(catchError(() => of([] as TwitchReward[])))
        : of([]),
    ),
  );
  readonly commands$ = this.refresh$.pipe(
    switchMap(() => this.selectedChannelId$),
    switchMap((channelId) => (channelId ? this.commandService.getCustomCommands(channelId) : of([]))),
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  linkRewardCommand($event: [ChannelReward, CommandInfo]) {
    const [reward, command] = $event;
    this.selectedChannelId$
      .pipe(
        take(1),
        filter((channelId): channelId is string => !!channelId),
        map((channelId) => channelId.split('/')[1]),
        switchMap((channelName) => this.twitchApi.linkReward(channelName, reward.id, command.name)),
        tap(() => this.refresh$.next()),
      )
      .subscribe();
  }

  unlinkRewardCommand($event: ChannelReward) {
    this.dialog
      .ask('Unlink Reward', 'Are you sure you want to unlink this reward from its command?')
      .pipe(
        filter((res) => res === true),
        switchMap(() => this.selectedChannelId$.pipe(take(1))),
        filter((channelId): channelId is string => !!channelId),
        map((channelId) => channelId.split('/')[1]),
        switchMap((channelName) => this.twitchApi.unlinkReward(channelName, $event.id)),
        tap(() => this.refresh$.next()),
      )
      .subscribe();
  }
}
