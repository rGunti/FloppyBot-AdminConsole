import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { bootstrapDiscord, bootstrapFolder2Open, bootstrapQuestion, bootstrapTwitch } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { ChannelService } from '../../utils/channel/channel.service';
import { ChannelIconPipe } from '../../utils/channel/channel-icon.pipe';
import { ChannelIdPipe } from '../../utils/channel/channel-id.pipe';
import { ChannelNamePipe } from '../../utils/channel/channel-name.pipe';

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
    ChannelIdPipe,
  ],
})
export class ChannelSelectorComponent implements OnDestroy {
  private readonly destroyed$ = new Subject<void>();

  private readonly router = inject(Router);
  private readonly channelService = inject(ChannelService);

  readonly channels$ = this.channelService.getAccessibleChannels();
  readonly form = new FormControl<string | null>(null);

  constructor() {
    this.channelService.selectedChannelId$
      .pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((channel) => {
        console.log('ChannelSelectorComponent selectedChannelId$', channel);
        this.form.setValue(channel!);
      });

    this.form.valueChanges.pipe(takeUntil(this.destroyed$), distinctUntilChanged()).subscribe((channel) => {
      console.log('ChannelSelectorComponent form.valueChanges', channel);
      this.router.navigate([], { queryParams: { channel } });
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
