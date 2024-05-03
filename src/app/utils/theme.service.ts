import { ApplicationRef, inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const ALT_THEME_CLASS = 'dark-mode';

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
  private readonly altThemeEnabled$ = new BehaviorSubject<boolean>(false);

  readonly alternativeThemeEnabled$ = this.altThemeEnabled$.asObservable();

  constructor() {
    this.altThemeEnabled$.subscribe(updateBodyClass);

    const darkModePreference = detectDarkModePreference();
    if (!darkModePreference) {
      this.altThemeEnabled$.next(true);
    }

    window
      .matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', this.handleColorPreferenceChange.bind(this));
  }

  ngOnDestroy(): void {
    this.altThemeEnabled$.complete();
    window
      .matchMedia('(prefers-color-scheme: light)')
      .removeEventListener('change', this.handleColorPreferenceChange.bind(this));
  }

  toggleTheme(): void {
    this.altThemeEnabled$.next(!this.altThemeEnabled$.value);
  }

  private handleColorPreferenceChange(event: MediaQueryListEvent): void {
    this.altThemeEnabled$.next(event.matches);
    this.appRef.tick();
  }
}
