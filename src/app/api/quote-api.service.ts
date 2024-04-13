import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getUrl } from '../utils/api';

import { Quote } from './entities';

// const NAMES = ['John Doe', 'Jane Doe', 'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi'];
// const GAMES = ['Chess', 'Checkers', 'Go', 'Poker', 'Bridge', 'Monopoly', 'Risk', 'Catan', 'Scrabble', 'Clue'];

@Injectable({
  providedIn: 'root',
})
export class QuoteApiService {
  private readonly http = inject(HttpClient);

  getQuotesForChannel(channelId: string): Observable<Quote[]> {
    // console.log('Calling fake API QuoteApiService.getQuotesForChannel', channelId);
    // return of(
    //   Array.from({ length: 123 }, (_, i) => i + 1).map((i) => ({
    //     id: i.toString(),
    //     channelMappingId: channelId,
    //     quoteId: i,
    //     quoteText: `Quote ${i} text for ${channelId}`,
    //     quoteContext: GAMES[getRandomNumber(0, GAMES.length - 1)],
    //     createdAt: new Date(),
    //     createdBy: NAMES[getRandomNumber(0, NAMES.length - 1)],
    //   })),
    // );
    return this.http.get<Quote[]>(getUrl(`/api/v2/quotes/${channelId}`));
  }

  updateQuote(channelId: string, quote: Quote): Observable<void> {
    return this.http.put<void>(`/api/v2/quotes/${channelId}/${quote.quoteId}`, quote);
  }

  deleteQuote(channelId: string, quoteId: number): Observable<void> {
    return this.http.delete<void>(getUrl(`/api/v2/quotes/${channelId}/${quoteId}`));
  }
}
