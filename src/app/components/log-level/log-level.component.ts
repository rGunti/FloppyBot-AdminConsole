import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  bootstrapCodeSquare,
  bootstrapExclamationTriangle,
  bootstrapInfoCircle,
  bootstrapSignStop,
  bootstrapTextLeft,
  bootstrapXCircle,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent } from '@ng-icons/core';

import { LogLevel } from '../../api/entities';

@Component({
  selector: 'fac-log-level',
  standalone: true,
  imports: [MatIcon, NgIconComponent, MatTooltip],
  templateUrl: './log-level.component.html',
  styleUrl: './log-level.component.scss',
})
export class LogLevelComponent {
  @Input({ required: true }) level = LogLevel.Verbose;

  get logIcon() {
    switch (this.level) {
      case LogLevel.Fatal:
        return bootstrapSignStop;
      case LogLevel.Error:
        return bootstrapXCircle;
      case LogLevel.Warning:
        return bootstrapExclamationTriangle;
      case LogLevel.Information:
        return bootstrapInfoCircle;
      case LogLevel.Debug:
        return bootstrapCodeSquare;
      case LogLevel.Verbose:
        return bootstrapTextLeft;
      default:
        return '';
    }
  }
}
