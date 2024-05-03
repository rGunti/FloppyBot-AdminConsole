import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { bootstrapMoonStars, bootstrapSun } from '@ng-icons/bootstrap-icons';
import { NgIconComponent } from '@ng-icons/core';
import { map } from 'rxjs';

import { ThemeService } from '../../utils/theme.service';

@Component({
  selector: 'fac-theme-button',
  standalone: true,
  imports: [CommonModule, MatIconButton, MatIcon, NgIconComponent, MatTooltip],
  providers: [],
  templateUrl: './theme-button.component.html',
  styleUrl: './theme-button.component.scss',
})
export class ThemeButtonComponent {
  private readonly themeService = inject(ThemeService);

  readonly isDarkMode$ = this.themeService.alternativeThemeEnabled$;
  readonly themeIcon$ = this.isDarkMode$.pipe(map((isDarkMode) => (isDarkMode ? bootstrapMoonStars : bootstrapSun)));

  changeTheme(): void {
    this.themeService.toggleTheme();
  }
}
