import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBar } from '@angular/material/progress-bar';

import { FileSizePipe } from '../../utils/files/file-size.pipe';

import { FileStorageQuotaComponent } from './file-storage-quota.component';

describe('FileStorageQuotaComponent', () => {
  let component: FileStorageQuotaComponent;
  let fixture: ComponentFixture<FileStorageQuotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileStorageQuotaComponent, MatProgressBar, FileSizePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(FileStorageQuotaComponent);
    component = fixture.componentInstance;
    component.quota = {
      channelId: 'channel-id',
      maxStorageQuota: 12_345_678,
      maxFileNumber: 100,
      storageUsed: 123_456,
      fileCount: 12,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
