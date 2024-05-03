import { Injectable, Provider } from '@angular/core';

import { LocalStorageService } from './base';

@Injectable({
  providedIn: 'root',
})
class RealLocalStorageService extends LocalStorageService {
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value);
  }

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
    this.itemChangedSubject.next(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.itemChangedSubject.next(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

export function provideLocalStorageService(): Provider[] {
  return [
    {
      provide: LocalStorageService,
      useClass: RealLocalStorageService,
    },
  ];
}
