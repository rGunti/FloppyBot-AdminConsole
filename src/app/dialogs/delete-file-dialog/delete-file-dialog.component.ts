import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { FileHeader } from '../../api/entities';
import { FileSizePipe } from '../../utils/files/file-size.pipe';

@Component({
  selector: 'fac-delete-file-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FileSizePipe],
  templateUrl: './delete-file-dialog.component.html',
  styleUrl: './delete-file-dialog.component.scss',
})
export class DeleteFileDialogComponent {
  readonly file: FileHeader = inject(MAT_DIALOG_DATA);
}
