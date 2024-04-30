import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapXLg } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { map, shareReplay, tap } from 'rxjs';

import { UserApiService } from '../../../api/user-api.service';
import { ChannelService } from '../../../utils/channel/channel.service';
import { DialogService } from '../../../utils/dialog.service';

@Component({
  selector: 'fac-channel-aliases',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgIconComponent,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  providers: [provideIcons({ bootstrapXLg })],
  templateUrl: './channel-aliases.component.html',
  styleUrl: './channel-aliases.component.scss',
})
export class ChannelAliasesComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userApi = inject(UserApiService);
  private readonly channelService = inject(ChannelService);
  private readonly dialog = inject(DialogService);

  private readonly userInfo$ = this.userApi.getMe().pipe(shareReplay(1));
  readonly form$ = this.userInfo$.pipe(
    map((userInfo) => {
      const form = this.formBuilder.group({});
      for (const channel of userInfo.ownerOf) {
        form.addControl(channel, this.formBuilder.control(userInfo.channelAliases[channel] ?? ''));
      }
      return form;
    }),
  );

  clearValue(formControl: FormControl): void {
    formControl.setValue('');
  }

  onSaveChanges(form: FormGroup): void {
    const aliases = form.value as Record<string, string>;
    this.userApi
      .updateChannelAliases(aliases)
      .pipe(tap(() => this.dialog.success('Channel aliases saved')))
      .subscribe(() => {
        this.channelService.invalidateCache();
      });
  }
}
