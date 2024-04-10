import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { FileHeader } from '../../../api/entities';
import { MatIconModule } from '@angular/material/icon';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { MatButtonModule } from '@angular/material/button';
import { bootstrapDownload, bootstrapFileEarmark, bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, of, switchMap, takeUntil } from 'rxjs';
import { FileApiService } from '../../../api/file-api.service';
import { FileSizePipe } from '../../../utils/files/file-size.pipe';
import { ChannelService } from '../../../utils/channel/channel.service';

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
  ],
  providers: [
    provideIcons({
      bootstrapTrash,
      bootstrapFileEarmark,
      bootstrapDownload,
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
  readonly dataSource$ = this.channelService.selectedChannelId$.pipe(
    takeUntil(this.destroy$),
    switchMap((channelId) => (channelId ? this.fileApi.getFilesForChannel(channelId) : of([]))),
  );
  readonly dataSource = new MatTableDataSource<FileHeader>([]);

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
