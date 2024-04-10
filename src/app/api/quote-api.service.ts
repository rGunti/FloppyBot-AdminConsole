import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Quote } from './entities';
import { getRandomNumber } from '../utils/rng';

const NAMES = ['John Doe', 'Jane Doe', 'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi'];
const GAMES = ['Chess', 'Checkers', 'Go', 'Poker', 'Bridge', 'Monopoly', 'Risk', 'Catan', 'Scrabble', 'Clue'];

@Injectable({
  providedIn: 'root',
})
export class QuoteApiService {
  getQuotesForChannel(channelId: string): Observable<Quote[]> {
    console.log('Calling fake API QuoteApiService.getQuotesForChannel', channelId);
    return of(
      Array.from({ length: 123 }, (_, i) => i + 1).map((i) => ({
        id: i.toString(),
        channel: channelId,
        quoteId: i,
        quoteText: `Quote ${i} text for ${channelId}`,
        quoteContext: GAMES[getRandomNumber(0, GAMES.length - 1)],
        createdAt: new Date(),
        createdBy: NAMES[getRandomNumber(0, NAMES.length - 1)],
      })),
    );
  }
}
