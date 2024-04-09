import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapDiscord, bootstrapFolder2Open, bootstrapQuestion, bootstrapTwitch } from '@ng-icons/bootstrap-icons';
import { Channel } from '../../utils/channel/channel.entities';
import { ChannelService } from '../../utils/channel/channel.service';
import { ChannelNamePipe } from '../../utils/channel/channel-name.pipe';
import { ChannelIconPipe } from '../../utils/channel/channel-icon.pipe';
import { Subject, filter, first, map, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'fac-channel-selector',
  standalone: true,
  providers: [
    provideIcons({
      bootstrapTwitch,
      bootstrapDiscord,
      bootstrapQuestion,
      bootstrapFolder2Open,
    }),
  ],
  templateUrl: './channel-selector.component.html',
  styleUrl: './channel-selector.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    NgIconComponent,
    ChannelNamePipe,
    ChannelIconPipe,
  ],
})
export class ChannelSelectorComponent implements AfterViewInit, OnDestroy {
  private readonly destroyed$ = new Subject();

  private readonly router = inject(Router);
  private readonly channelService = inject(ChannelService);

  readonly form = new FormControl<Channel | null>(null);

  @Input() channels: Channel[] = [
    { type: 'Twitch', id: 'Channel1' },
    { type: 'Discord', id: '72136387162378123' },
    { type: 'Unknown', id: '123', alias: 'Does not exist' },
  ];
  @Output() channelSelected = new EventEmitter<Channel | null | undefined>();

  ngAfterViewInit(): void {
    this.router.routerState.root.queryParams
      .pipe(
        first(),
        takeUntil(this.destroyed$),
        filter((params) => params['channel'] !== undefined),
        map((params) => params['channel']!),
        map((channelId) => this.channels.find((channel) => this.channelService.getChannelId(channel) === channelId)),
      )
      .subscribe((channel) => {
        this.form.setValue(channel!);
      });

    this.form.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        filter((channel) => !!channel),
      )
      .subscribe((channel) => {
        this.channelSelected.emit(channel);
        this.router.navigate([], { queryParams: { channel: this.channelService.getChannelId(channel!) } });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
