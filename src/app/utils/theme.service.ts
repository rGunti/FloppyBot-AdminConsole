import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const ALT_THEME_COLOR = 'dark-mode';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly darkMode$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.darkMode$.subscribe((isDarkMode) => {
      if (isDarkMode) {
        document.body.classList.add(ALT_THEME_COLOR);
      } else {
        document.body.classList.remove(ALT_THEME_COLOR);
      }
    });
  }

  get darkMode() {
    return this.darkMode$.asObservable();
  }

  get isDarkMode(): boolean {
    return this.darkMode$.value;
  }

  set isDarkMode(isDarkMode: boolean) {
    this.darkMode$.next(isDarkMode);
  }

  ngOnDestroy(): void {
    this.darkMode$.complete();
  }
}
