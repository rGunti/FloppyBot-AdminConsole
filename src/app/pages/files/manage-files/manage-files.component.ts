import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  bootstrapDownload,
  bootstrapFileEarmark,
  bootstrapFileEarmarkImage,
  bootstrapFileEarmarkMusic,
  bootstrapFileEarmarkPdf,
  bootstrapFileEarmarkZip,
  bootstrapTrash,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { of, Subject, switchMap, takeUntil } from 'rxjs';

import { FileHeader } from '../../../api/entities';
import { FileApiService } from '../../../api/file-api.service';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { FileStorageQuotaComponent } from '../../../components/file-storage-quota/file-storage-quota.component';
import { ChannelService } from '../../../utils/channel/channel.service';
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
  ],
  providers: [
    provideIcons({
      bootstrapTrash,
      bootstrapDownload,
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
  private readonly fileApi = inject(FileApiService);
  private readonly channelService = inject(ChannelService);
  private readonly destroy$ = new Subject<void>();

  readonly displayedColumns: string[] = ['mimeType', 'fileName', 'fileSize', 'actions'];
  readonly dataSource = new MatTableDataSource<FileHeader>([]);

  readonly dataSource$ = this.channelService.selectedChannelId$.pipe(
    takeUntil(this.destroy$),
    switchMap((channelId) => (channelId ? this.fileApi.getFilesForChannel(channelId) : of([]))),
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
}
