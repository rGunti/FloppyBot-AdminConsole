import { Injectable, Provider } from '@angular/core';

import { LocalStorageService } from './base';

@Injectable({
  providedIn: 'root',
})
export class FakeLocalStorageService extends LocalStorageService {
  private readonly storage = new Map<string, string>();

  hasItem(key: string): boolean {
    return this.storage.has(key);
  }

  getItem<T>(key: string): T | null {
    const value = this.storage.get(key);
    if (value === undefined) {
      return null;
    }
    return JSON.parse(value);
  }

  setItem<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value));
    this.itemChangedSubject.next(key);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
    this.itemChangedSubject.next(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

export function provideFakeLocalStorageService(): Provider[] {
  return [
    {
      provide: LocalStorageService,
      useClass: FakeLocalStorageService,
    },
  ];
}
