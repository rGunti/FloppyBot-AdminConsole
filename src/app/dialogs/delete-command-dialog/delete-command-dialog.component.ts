import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { CommandInfo } from '../../api/entities';

@Component({
  selector: 'fac-delete-command-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './delete-command-dialog.component.html',
  styleUrl: './delete-command-dialog.component.scss',
})
export class DeleteCommandDialogComponent {
  readonly command: CommandInfo = inject(MAT_DIALOG_DATA);
}
