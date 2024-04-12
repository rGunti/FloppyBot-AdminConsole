import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { filter, map, shareReplay, switchMap } from 'rxjs';

import { FileApiService } from '../../api/file-api.service';
import { ChannelService } from '../../utils/channel/channel.service';
import { FileSizePipe } from '../../utils/files/file-size.pipe';

@Component({
  selector: 'fac-file-storage-quota',
  standalone: true,
  templateUrl: './file-storage-quota.component.html',
  styleUrl: './file-storage-quota.component.scss',
  imports: [CommonModule, MatProgressBar, FileSizePipe],
})
export class FileStorageQuotaComponent {
  private readonly channel = inject(ChannelService);
  private readonly fileApi = inject(FileApiService);

  readonly quota$ = this.channel.selectedChannelId$.pipe(
    filter((channelId) => !!channelId),
    switchMap((channelId) => this.fileApi.getFileQuota(channelId!)),
    shareReplay(1),
  );
  readonly storageQuotaPercentage$ = this.quota$.pipe(
    map((quota) => (quota.storageUsed / quota.maxStorageQuota) * 100),
  );
}
