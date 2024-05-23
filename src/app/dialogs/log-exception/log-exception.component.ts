import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { LogRecord } from '../../api/entities';

@Component({
  selector: 'fac-log-exception',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButton],
  templateUrl: './log-exception.component.html',
  styleUrl: './log-exception.component.scss',
})
export class LogExceptionComponent {
  readonly logRecord: LogRecord = inject(MAT_DIALOG_DATA);
}
