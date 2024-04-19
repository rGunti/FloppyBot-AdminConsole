import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBar, ProgressBarMode } from '@angular/material/progress-bar';
import { from, map, mergeMap } from 'rxjs';

import { FileApiService } from '../../api/file-api.service';
import { FileDropZoneComponent } from '../../components/file-drop-zone/file-drop-zone.component';
import { DialogService } from '../../utils/dialog.service';

@Component({
  selector: 'fac-upload-file-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FileDropZoneComponent, MatProgressBar],
  templateUrl: './upload-file-dialog.component.html',
  styleUrl: './upload-file-dialog.component.scss',
})
export class UploadFileDialogComponent {
  private readonly selectedChannel: string = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UploadFileDialogComponent>);
  private readonly fileApi = inject(FileApiService);
  private readonly dialog = inject(DialogService);

  mode: ProgressBarMode = 'determinate';
  progress = 0;
  status = 'Ready';

  onFilesSelected(files: FileList): void {
    console.log('UploadFileDialog', 'Got files', files);
    if (files.length === 0) {
      console.error('UploadFileDialog', 'No files selected');
      return;
    }

    this.mode = 'indeterminate';

    const filesToUpload = [];
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      filesToUpload.push(files[fileIndex]);
    }

    from(filesToUpload)
      .pipe(
        mergeMap(
          (file, index) =>
            this.fileApi.uploadFile(this.selectedChannel, file).pipe(
              map((progress) => ({
                progress,
                file,
                index,
              })),
            ),
          1,
        ),
      )
      .subscribe({
        next: (status) => {
          console.log('UploadFileDialog', 'Upload status', status);
          this.mode = 'determinate';
          this.progress = status.progress.percentage;
          this.status = `Uploading ${status.file.name} (${status.index + 1}/${filesToUpload.length})`;
        },
        error: (error) => {
          console.error('UploadFileDialog', 'Upload error', error);
        },
        complete: () => {
          console.log('UploadFileDialog', 'Upload complete');
          this.dialog.success('Upload complete');
          this.dialogRef.close();
        },
      });
  }
}
