import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Channel } from './entities';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  getAccessibleChannels(): Observable<Channel[]> {
    return of([
      { type: 'Twitch', id: 'Channel1' },
      { type: 'Discord', id: '72136387162378123' },
      { type: 'Unknown', id: '123', alias: 'Does not exist' },
    ]);
  }
}
