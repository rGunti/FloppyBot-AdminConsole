import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapCopy } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, filter, of, switchMap } from 'rxjs';

import { DialogService } from '../../utils/dialog.service';
import { StreamSourceService } from '../../utils/stream-source.service';

@Component({
  selector: 'fac-stream-source-url',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    NgIconComponent,
    MatTooltipModule,
  ],
  providers: [
    provideIcons({
      bootstrapCopy,
    }),
  ],
  templateUrl: './stream-source-url.component.html',
  styleUrl: './stream-source-url.component.scss',
})
export class StreamSourceUrlComponent {
  private readonly streamSource = inject(StreamSourceService);
  private readonly selectedChannelSubject = new BehaviorSubject<string | null | undefined>(undefined);
  private readonly clipboard = inject(Clipboard);
  private readonly dialog = inject(DialogService);

  readonly streamSourceLink$ = this.selectedChannelSubject.pipe(
    switchMap((channelId) => (channelId ? this.streamSource.getStreamSourceUrl(channelId) : of(null))),
  );
  readonly disableCopyButton$ = this.streamSourceLink$.pipe(filter((link) => !link));

  @Input() get selectedChannel(): string | null | undefined {
    return this.selectedChannelSubject.value;
  }
  set selectedChannel(channelId: string | null | undefined) {
    this.selectedChannelSubject.next(channelId);
  }

  copyStreamSourceLink(streamSourceLink: string): void {
    this.clipboard.copy(streamSourceLink);
    this.dialog.success('Stream source link copied to clipboard');
  }
}
