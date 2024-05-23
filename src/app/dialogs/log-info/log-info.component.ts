import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { LogRecord } from '../../api/entities';
import { LogLevelComponent } from '../../components/log-level/log-level.component';
import { DateFormatPipe } from '../../utils/date-format.pipe';

@Component({
  selector: 'fac-log-info',
  standalone: true,
  imports: [CommonModule, MatButton, MatDialogModule, DateFormatPipe, LogLevelComponent],
  templateUrl: './log-info.component.html',
  styleUrl: './log-info.component.scss',
})
export class LogInfoComponent {
  readonly logRecord: LogRecord = inject(MAT_DIALOG_DATA);
}
