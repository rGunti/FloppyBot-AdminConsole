import { ApplicationRef, inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, map, Subject, takeUntil } from 'rxjs';

import { LocalStorageService } from './local-storage';

const ALT_THEME_CLASS = 'alt-theme';
const ALT_THEME_KEY = 'alt-theme-enabled';

function detectDarkModePreference(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateBodyClass(altThemeEnabled: boolean): void {
  if (altThemeEnabled) {
    document.body.classList.add(ALT_THEME_CLASS);
  } else {
    document.body.classList.remove(ALT_THEME_CLASS);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly appRef = inject(ApplicationRef);
  private readonly localStorage = inject(LocalStorageService);

  private readonly destroy$ = new Subject<void>();
  private readonly altThemeEnabled$ = new BehaviorSubject<boolean>(false);

  readonly alternativeThemeEnabled$ = this.altThemeEnabled$.asObservable();

  constructor() {
    // Update the body class when the theme changes
    this.altThemeEnabled$.subscribe((altThemeEnabled) => {
      updateBodyClass(altThemeEnabled);
    });

    // Update the theme when the user changes it (indicated by local storage)
    this.localStorage.itemChanged$
      .pipe(
        takeUntil(this.destroy$),
        filter((key) => key === ALT_THEME_KEY),
        map(() => this.localStorage.getItem<boolean>(ALT_THEME_KEY) || false),
      )
      .subscribe((altThemeEnabledByUser) => {
        this.altThemeEnabled$.next(altThemeEnabledByUser);
      });

    // Set the theme based on the user's saved preference or browser preference
    const userHasAltThemeEnabled = this.localStorage.getItem<boolean>(ALT_THEME_KEY) || false;
    const browserPrefersDarkMode = detectDarkModePreference();
    if (userHasAltThemeEnabled || !browserPrefersDarkMode) {
      this.altThemeEnabled$.next(true);
    }

    // Subscribe to changes
    window
      .matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', this.handleColorPreferenceChange.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.altThemeEnabled$.complete();
    window
      .matchMedia('(prefers-color-scheme: light)')
      .removeEventListener('change', this.handleColorPreferenceChange.bind(this));
  }

  toggleTheme(): void {
    this.localStorage.setItem(ALT_THEME_KEY, !this.altThemeEnabled$.value);
  }

  private handleColorPreferenceChange(event: MediaQueryListEvent): void {
    this.altThemeEnabled$.next(event.matches);
    this.appRef.tick();
  }
}
