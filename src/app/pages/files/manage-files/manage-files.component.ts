import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  bootstrapDownload,
  bootstrapFileEarmark,
  bootstrapFileEarmarkImage,
  bootstrapFileEarmarkMusic,
  bootstrapFileEarmarkPdf,
  bootstrapFileEarmarkZip,
  bootstrapTrash,
  bootstrapUpload,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, filter, mergeMap, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

import { FileHeader } from '../../../api/entities';
import { FileApiService } from '../../../api/file-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { FileStorageQuotaComponent } from '../../../components/file-storage-quota/file-storage-quota.component';
import { DeleteFileDialogComponent } from '../../../dialogs/delete-file-dialog/delete-file-dialog.component';
import { UploadFileDialogComponent } from '../../../dialogs/upload-file-dialog/upload-file-dialog.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { DialogService } from '../../../utils/dialog.service';
import { FileIconPipe } from '../../../utils/files/file-icon.pipe';
import { FileSizePipe } from '../../../utils/files/file-size.pipe';

@Component({
  selector: 'fac-manage-files',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ChannelSelectorComponent,
    MatIconModule,
    NgIconComponent,
    MatButtonModule,
    MatTooltipModule,
    FileSizePipe,
    FileIconPipe,
    FileStorageQuotaComponent,
    MatToolbarModule,
  ],
  providers: [
    provideIcons({
      bootstrapTrash,
      bootstrapDownload,
      bootstrapUpload,
      bootstrapFileEarmark,
      bootstrapFileEarmarkMusic,
      bootstrapFileEarmarkZip,
      bootstrapFileEarmarkImage,
      bootstrapFileEarmarkPdf,
    }),
  ],
  templateUrl: './manage-files.component.html',
  styleUrl: './manage-files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageFilesComponent implements AfterViewInit, OnDestroy {
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();

  private readonly fileApi = inject(FileApiService);
  private readonly channelService = inject(ChannelService);
  private readonly dialog = inject(DialogService);

  readonly selectedChannelId$ = this.channelService.selectedChannelId$;

  readonly displayedColumns: string[] = ['mimeType', 'fileName', 'fileSize', 'actions'];
  readonly dataSource = new MatTableDataSource<FileHeader>([]);

  readonly dataSource$ = this.refresh$.pipe(
    mergeMap(() => this.channelService.selectedChannelId$),
    takeUntil(this.destroy$),
    switchMap((channelId) => (channelId ? this.fileApi.getFilesForChannel(channelId) : of([]))),
  );
  readonly quota$ = this.refresh$.pipe(
    mergeMap(() => this.channelService.selectedChannelId$),
    takeUntil(this.destroy$),
    switchMap((channelId) => (channelId ? this.fileApi.getFileQuota(channelId) : of(undefined))),
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource$.subscribe((files) => {
      this.dataSource.data = files;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDownloadTooltip(file: FileHeader): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `Download file "${file.fileName}"`;
  }

  getDeleteTooltip(file: FileHeader): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `Delete file "${file.fileName}"`;
  }

  deleteFile(file: FileHeader): void {
    this.dialog
      .show(DeleteFileDialogComponent, file)
      .pipe(
        filter((result) => !!result),
        switchMap(() =>
          this.channelService.selectedChannelId$.pipe(
            filter((i) => !!i),
            take(1),
          ),
        ),
        switchMap((channelId) => this.fileApi.deleteFile(channelId!, file.fileName)),
        tap(() => this.refresh$.next()),
      )
      .subscribe({
        next: () => this.dialog.success('File deleted'),
      });
  }

  uploadFile(): void {
    this.selectedChannelId$
      .pipe(
        take(1),
        switchMap((channelId) => this.dialog.show(UploadFileDialogComponent, channelId)),
      )
      .subscribe({
        next: () => this.refresh$.next(),
      });
  }

  downloadFile(file: FileHeader): void {
    this.selectedChannelId$
      .pipe(
        take(1),
        switchMap((channelId) => this.fileApi.downloadFile(channelId!, file.fileName)),
      )
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.fileName;
          a.click();
          URL.revokeObjectURL(url);
          a.remove();
        },
        error: () => this.dialog.error('Failed to download file'),
      });
  }
}
