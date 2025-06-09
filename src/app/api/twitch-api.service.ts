import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getUrl } from '../utils/api';

import { TwitchAuthenticationConfirm, TwitchAuthenticationStart } from './entities';

@Injectable({
  providedIn: 'root',
})
export class TwitchApiService {
  private readonly http = inject(HttpClient);

  hasCredentialsFor(channel: string): Observable<boolean> {
    return this.http.get<boolean>(getUrl(`/api/v2/twitch/${channel}`));
  }

  startNewSession(channel: string): Observable<TwitchAuthenticationStart> {
    return this.http.get<TwitchAuthenticationStart>(getUrl(`/api/v2/twitch/${channel}/auth`));
  }

  confirmSession(session: TwitchAuthenticationConfirm): Observable<void> {
    return this.http.post<void>(getUrl(`/api/v2/twitch/confirm`), session);
  }

  revokeSession(channel: string): Observable<void> {
    return this.http.delete<void>(getUrl(`/api/v2/twitch/${channel}/auth`));
  }
}
