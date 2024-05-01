import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { map, Observable, shareReplay } from 'rxjs';

import { VERSION } from '../../../version/version';
import { calculateDisplayVersion, Version } from '../../../version/version.interface';
import { AppUpdateService } from '../../utils/app-update.service';

@Component({
  selector: 'fac-app-version',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './app-version.component.html',
  styleUrl: './app-version.component.scss',
})
export class AppVersionComponent {
  private readonly appUpdateService = inject(AppUpdateService);
  readonly version = VERSION;

  readonly currentVersion = calculateDisplayVersion(VERSION);
  readonly latestVersion$ = this.appUpdateService.getServerVersion().pipe(shareReplay(1));

  readonly hasUpdates$ = this.latestVersion$.pipe(
    map((latestVersion) => latestVersion.version !== this.version.version),
  );

  readonly calculateDisplayVersion = calculateDisplayVersion;
  readonly calculateAsyncDisplayVersion = (version: Observable<Version>) => version.pipe(map(calculateDisplayVersion));

  getTitle(key: string): string {
    switch (key) {
      case 'angular':
        return 'Angular';
      case 'angularMaterial':
        return 'Angular Material';
      case 'typescript':
        return 'TypeScript';
      case 'node':
        return 'Node Version';
      case 'ngIcons':
        return 'ng-icons';
      default:
        return key;
    }
  }

  update(): void {
    window.location.reload();
  }
}
