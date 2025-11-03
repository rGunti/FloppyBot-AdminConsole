import { Component, Input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

import { FileStorageQuota } from '../../api/entities';
import { FileSizePipe } from '../../utils/files/file-size.pipe';

@Component({
  selector: 'fac-file-storage-quota',
  standalone: true,
  templateUrl: './file-storage-quota.component.html',
  styleUrl: './file-storage-quota.component.scss',
  imports: [MatProgressBar, FileSizePipe],
})
export class FileStorageQuotaComponent {
  @Input({ required: true }) quota!: FileStorageQuota | null | undefined;

  get quotaPercentage(): number {
    if (!this.quota) {
      return 0;
    }
    return (this.quota.storageUsed / this.quota.maxStorageQuota) * 100;
  }
}
