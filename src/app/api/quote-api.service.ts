import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Quote } from './entities';

@Injectable({
  providedIn: 'root',
})
export class QuoteApiService {
  getQuotesForChannel(channelId: string): Observable<Quote[]> {
    console.log('Calling fake API QuoteApiService.getQuotesForChannel', channelId);
    return of(
      Array.from({ length: 51 }, (_, i) => i + 1).map((i) => ({
        id: i.toString(),
        channel: channelId,
        quoteId: i,
        quoteText: `Quote ${i} text for ${channelId}`,
        createdAt: new Date(),
        createdBy: 'John Doe',
      })),
    );
  }
}
