import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { FileHeader } from '../../../api/entities';
import { MatIconModule } from '@angular/material/icon';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { MatButtonModule } from '@angular/material/button';
import {
  bootstrapDownload,
  bootstrapFileEarmark,
  bootstrapFileEarmarkImage,
  bootstrapFileEarmarkMusic,
  bootstrapFileEarmarkPdf,
  bootstrapFileEarmarkZip,
  bootstrapTrash,
} from '@ng-icons/bootstrap-icons';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, of, switchMap, takeUntil } from 'rxjs';
import { FileApiService } from '../../../api/file-api.service';
import { FileSizePipe } from '../../../utils/files/file-size.pipe';
import { ChannelService } from '../../../utils/channel/channel.service';
import { FileIconPipe } from '../../../utils/files/file-icon.pipe';

@Component({
  selector: 'fac-manage-files',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    ChannelSelectorComponent,
    MatIconModule,
    NgIconComponent,
    MatButtonModule,
    MatTooltipModule,
    FileSizePipe,
    FileIconPipe,
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
