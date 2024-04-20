import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getUrl } from '../utils/api';

import { Quote } from './entities';

@Injectable({
  providedIn: 'root',
})
export class QuoteApiService {
  private readonly http = inject(HttpClient);

  getQuotesForChannel(channelId: string): Observable<Quote[]> {
    return this.http.get<Quote[]>(getUrl(`/api/v2/quotes/${channelId}`));
  }

  updateQuote(channelId: string, quote: Quote): Observable<void> {
    return this.http.put<void>(getUrl(`/api/v2/quotes/${channelId}/${quote.quoteId}`), quote);
  }

  deleteQuote(channelId: string, quoteId: number): Observable<void> {
    return this.http.delete<void>(getUrl(`/api/v2/quotes/${channelId}/${quoteId}`));
  }
}
