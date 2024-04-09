import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import { Channel } from '../../../api/entities';
import { MatIconModule } from '@angular/material/icon';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { MatButtonModule } from '@angular/material/button';
import { bootstrapDownload, bootstrapFileEarmark, bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { MatTooltipModule } from '@angular/material/tooltip';

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
export class ManageFilesComponent implements AfterViewInit {
  readonly displayedColumns: string[] = ['icon', 'name', 'size', 'actions'];
  readonly dataSource = new MatTableDataSource([
    { name: 'File 1', size: '1.2 MB', date: '2021-01-01' },
    { name: 'File 2', size: '2.5 MB', date: '2021-01-02' },
    { name: 'File 3', size: '3.7 MB', date: '2021-01-03' },
    { name: 'File 4', size: '4.9 MB', date: '2021-01-04' },
    { name: 'File 5', size: '5.1 MB', date: '2021-01-05' },
    { name: 'File 6', size: '6.3 MB', date: '2021-01-06' },
    { name: 'File 7', size: '7.5 MB', date: '2021-01-07' },
    { name: 'File 8', size: '8.7 MB', date: '2021-01-08' },
    { name: 'File 9', size: '9.9 MB', date: '2021-01-09' },
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onChannelSelected(selectedChannel: Channel | null | undefined) {
    console.log('Selected channel:', selectedChannel);
  }

  getDownloadTooltip(file: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `Download file "${(file as any).name}"`;
  }

  getDeleteTooltip(file: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `Delete file "${(file as any).name}"`;
  }
}
