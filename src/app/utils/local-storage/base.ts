import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class LocalStorageService implements OnDestroy {
  protected readonly itemChangedSubject = new Subject<string>();

  get itemChanged$() {
    return this.itemChangedSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.itemChangedSubject.complete();
  }

  abstract hasItem(key: string): boolean;
  abstract getItem<T>(key: string): T | null;
  abstract setItem<T>(key: string, value: T): void;
  abstract removeItem(key: string): void;
  abstract clear(): void;
}
