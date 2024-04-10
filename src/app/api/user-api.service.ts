import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Channel } from './entities';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  getAccessibleChannels(): Observable<Channel[]> {
    console.log('Calling fake API UserApiService.getAccessibleChannels');
    return of([
      { interface: 'Twitch', channel: 'Channel1' },
      { interface: 'Discord', channel: '72136387162378123' },
      { interface: 'Unknown', channel: '123', alias: 'Does not exist' },
    ]);
  }
}
