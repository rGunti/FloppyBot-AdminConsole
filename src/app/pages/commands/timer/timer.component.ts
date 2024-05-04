import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIconComponent } from '@ng-icons/core';
import { BehaviorSubject, filter, map, merge, of, shareReplay, startWith, switchMap, take, tap } from 'rxjs';

import { CommandApiService } from '../../../api/command-api.service';
import { TimerMessageConfig } from '../../../api/entities';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { DialogService } from '../../../utils/dialog.service';

function isMessage(message: string): boolean {
  return message.trim().length > 0;
}

@Component({
  selector: 'fac-timer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIconComponent,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ChannelSelectorComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent {
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly messageCountRefresh$ = new BehaviorSubject<void>(undefined);

  private readonly channelService = inject(ChannelService);
  private readonly commandApiService = inject(CommandApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialog = inject(DialogService);

  readonly channelInterfaceFilter = ['Twitch'];
  readonly form = this.formBuilder.group({
    channelId: ['', Validators.required],
    messages: [''],
    interval: [0, [Validators.required, Validators.min(0)]],
    minMessages: [0, [Validators.required, Validators.min(0)]],
  });

  readonly messageCount$ = merge(this.messageCountRefresh$, this.form.get('messages')!.valueChanges).pipe(
    startWith(undefined),
    map(() => this.form.get('messages')!.value),
    map((messages) => messages?.split('\n').filter(isMessage).length || 0),
    startWith(0),
  );
  readonly messageRows$ = this.messageCount$.pipe(
    map((count) => Math.max(count, 2) + 1),
    startWith(3),
  );

  readonly selectedChannel$ = this.channelService.selectedChannelId$.pipe(
    map((channelId) => {
      if (!channelId) {
        return null;
      }

      const parsedChannel = this.channelService.parseChannelFromChannelId(channelId);
      return this.channelInterfaceFilter.indexOf(parsedChannel.interface) >= 0 ? channelId : null;
    }),
  );
  readonly config$ = this.refresh$.pipe(
    switchMap(() => this.selectedChannel$),
    switchMap((channelId) => {
      if (!channelId) {
        return of(null);
      }

      return this.commandApiService.getTimerConfigForChannel(channelId);
    }),
    tap((config) => {
      if (!config) {
        return;
      }

      this.form.reset();
      this.form.patchValue({
        channelId: config.channelId,
        messages: config.messages.join('\n'),
        interval: config.interval,
        minMessages: config.minMessages,
      });
      this.messageCountRefresh$.next();
    }),
    shareReplay(1),
  );

  onSaveChanges(): void {
    const formValue = this.form.value;
    const config: TimerMessageConfig = {
      channelId: formValue.channelId!,
      messages: (formValue.messages?.split('\n') || []).filter(isMessage),
      interval: formValue.interval!,
      minMessages: formValue.minMessages!,
    };

    this.selectedChannel$
      .pipe(
        take(1),
        filter((channel) => !!channel),
        switchMap((channel) => this.commandApiService.setTimerConfigForChannel(channel!, config)),
        tap(() => this.refresh$.next()),
      )
      .subscribe(() => {
        this.dialog.success('Timer Messages saved');
      });
  }
}
