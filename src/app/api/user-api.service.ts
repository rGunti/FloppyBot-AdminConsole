import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getUrl } from '../utils/api';

import { ApiKeyReport, UserReport } from './entities';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly http = inject(HttpClient);

  getMe(): Observable<UserReport> {
    return this.http.get<UserReport>(getUrl(`/api/v2/user/me`));
  }

  getAccessKey(): Observable<ApiKeyReport> {
    return this.http.get<ApiKeyReport>(getUrl(`/api/v2/user/access-key`));
  }

  regenerateAccessKey(): Observable<void> {
    return this.http.post<void>(getUrl(`/api/v2/user/access-key/generate`), null);
  }
}
