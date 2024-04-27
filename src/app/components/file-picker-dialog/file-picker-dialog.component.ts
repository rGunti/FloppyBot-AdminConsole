import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgIconComponent } from '@ng-icons/core';
import { map } from 'rxjs';

import { FileApiService } from '../../api/file-api.service';
import { FileIconPipe } from '../../utils/files/file-icon.pipe';
import { FileSizePipe } from '../../utils/files/file-size.pipe';

export interface FilePickerDialogOptions {
  restrictToChannel: string;
  restrictToTypes: string[];
}

@Component({
  selector: 'fac-file-picker-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NgIconComponent,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    FileSizePipe,
    FileIconPipe,
  ],
  templateUrl: './file-picker-dialog.component.html',
  styleUrl: './file-picker-dialog.component.scss',
})
export class FilePickerDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<FilePickerDialogComponent>);
  private readonly fileApi = inject(FileApiService);

  readonly options: FilePickerDialogOptions = inject(MAT_DIALOG_DATA);
  readonly files$ = this.fileApi.getFilesForChannel(this.options.restrictToChannel).pipe(
    map((files) => {
      if (this.options.restrictToTypes.length === 0) {
        return files;
      }
      return files.filter((file) => this.options.restrictToTypes.includes(file.mimeType));
    }),
  );
}
