import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { LogRecord } from '../../api/entities';
import { LogLevelComponent } from '../../components/log-level/log-level.component';
import { DateFormatPipe } from '../../utils/date-format.pipe';
import { DialogService } from '../../utils/dialog.service';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { LogExceptionComponent } from '../log-exception/log-exception.component';

@Component({
  selector: 'fac-log-info',
  standalone: true,
  templateUrl: './log-info.component.html',
  styleUrl: './log-info.component.scss',
  imports: [CommonModule, MatButton, MatDialogModule, DateFormatPipe, LogLevelComponent, TruncatePipe],
})
export class LogInfoComponent {
  private readonly dialog = inject(DialogService);

  readonly logRecord: LogRecord = inject(MAT_DIALOG_DATA);

  showException() {
    this.dialog.show(LogExceptionComponent, this.logRecord).subscribe();
  }
}
