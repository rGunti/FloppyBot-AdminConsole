import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressBar, ProgressBarMode } from '@angular/material/progress-bar';
import { map, Observable } from 'rxjs';

import { LoadingIndicatorService } from '../../utils/loading-indicator.service';

@Component({
  selector: 'fac-global-loading-indicator',
  standalone: true,
  imports: [CommonModule, MatProgressBar],
  templateUrl: './global-loading-indicator.component.html',
  styleUrl: './global-loading-indicator.component.scss',
})
export class GlobalLoadingIndicatorComponent {
  private readonly visible$ = inject(LoadingIndicatorService).visible$;
  readonly progressBarMode$: Observable<ProgressBarMode> = this.visible$.pipe(
    map((visible) => (visible ? 'indeterminate' : 'determinate')),
  );
}
