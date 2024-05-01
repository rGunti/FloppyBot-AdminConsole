import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { VERSION } from '../../version/version';
import { Version } from '../../version/version.interface';

@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  private readonly http = inject(HttpClient);

  getServerVersion(): Observable<Version> {
    return this.http.get<Version>(`/assets/version.json?_=${new Date().getTime()}`);
  }

  hasUpdates(): Observable<boolean> {
    return this.getServerVersion().pipe(map((latestVersion) => latestVersion.version !== VERSION.version));
  }
}
