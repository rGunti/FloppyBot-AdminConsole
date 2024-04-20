import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { getUrl } from '../utils/api';

import { ApiKeyReport, Channel, UserReport } from './entities';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly http = inject(HttpClient);

  getAccessibleChannels(): Observable<Channel[]> {
    console.log('Calling fake API UserApiService.getAccessibleChannels');
    return of([
      { interface: 'Twitch', channel: 'Channel1' },
      { interface: 'Discord', channel: '72136387162378123' },
      { interface: 'Unknown', channel: '123', alias: 'Does not exist' },
    ]);
  }

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
