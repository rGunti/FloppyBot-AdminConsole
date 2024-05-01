import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserApiService } from '../api/user-api.service';

@Injectable({
  providedIn: 'root',
})
export class StreamSourceService {
  private readonly userApi = inject(UserApiService);
  private readonly streamSourceSettings = environment.streamSource;

  private readonly accessKey$ = this.userApi.getAccessKey().pipe(shareReplay(1));

  getStreamSourceUrl(channelId: string): Observable<string> {
    return this.accessKey$.pipe(
      map((report) => {
        if (!report.accessKey) throw new Error('Access key not found');
        return this.buildStreamSourceUrl(this.streamSourceSettings.baseUrl, channelId, report.accessKey);
      }),
    );
  }

  buildStreamSourceUrl(baseUrl: string, channel: string, accessKey: string): string {
    const params = new HttpParams({ fromObject: { channel, accessKey } });
    return `${baseUrl}?${params.toString()}`;
  }
}
