import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapArrowCounterclockwise } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, of, Subject, switchMap } from 'rxjs';

import { CommandApiService } from '../../../api/command-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { CommandListComponent } from '../../../components/command-list/command-list.component';
import { ChannelService } from '../../../utils/channel/channel.service';

@Component({
  selector: 'fac-custom-commands',
  standalone: true,
  imports: [
    CommonModule,
    ChannelSelectorComponent,
    CommandListComponent,
    MatToolbarModule,
    MatIconModule,
    NgIconComponent,
    MatButtonModule,
    MatTooltipModule,
  ],
  providers: [
    provideIcons({
      bootstrapArrowCounterclockwise,
    }),
  ],
  templateUrl: './custom-commands.component.html',
  styleUrl: './custom-commands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCommandsComponent implements OnDestroy {
  readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();

  private readonly channelService = inject(ChannelService);
  private readonly commandApi = inject(CommandApiService);

  readonly selectedChannelId$ = this.channelService.selectedChannelId$;
  readonly commands$ = this.channelService.selectedChannelId$.pipe(
    switchMap((channelId) => (channelId ? this.commandApi.getCustomCommandsForChannel(channelId) : of([]))),
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
