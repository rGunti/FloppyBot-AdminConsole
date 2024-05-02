import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { filter, map, of, shareReplay, switchMap, take, tap } from 'rxjs';

import { CommandApiService } from '../../../api/command-api.service';
import { ShoutoutCommandConfig } from '../../../api/entities';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { DialogService } from '../../../utils/dialog.service';

@Component({
  selector: 'fac-shoutout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChannelSelectorComponent,
    MatIconModule,
    NgIconComponent,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  providers: [provideIcons({})],
  templateUrl: './shoutout.component.html',
  styleUrl: './shoutout.component.scss',
})
export class ShoutoutComponent {
  private readonly channelService = inject(ChannelService);
  private readonly commandApiService = inject(CommandApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialog = inject(DialogService);

  readonly channelInterfaceFilter = ['Twitch'];
  readonly form = this.formBuilder.group({
    message: [''],
  });

  readonly selectedChannel$ = this.channelService.selectedChannelId$.pipe(
    map((channelId) => {
      if (!channelId) {
        return null;
      }

      const parsedChannel = this.channelService.parseChannelFromChannelId(channelId);
      return this.channelInterfaceFilter.indexOf(parsedChannel.interface) >= 0 ? channelId : null;
    }),
  );
  readonly shoutoutMessage$ = this.selectedChannel$.pipe(
    switchMap((channel) => (channel ? this.commandApiService.getShoutoutCommandMessage(channel) : of(null))),
    tap((message) => {
      if (message) {
        this.form.reset();
        this.form.patchValue(message);
      }
    }),
    shareReplay(1),
  );

  saveChanges(): void {
    const formValue: ShoutoutCommandConfig = {
      message: this.form.value.message!,
    };

    this.selectedChannel$
      .pipe(
        take(1),
        filter((channel) => !!channel),
        switchMap((channel) => this.commandApiService.setShoutoutCommandMessage(channel!, formValue)),
      )
      .subscribe(() => {
        this.dialog.success('Shoutout Command saved');
      });
  }
}
