import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { bootstrapBook, bootstrapEyeglasses, bootstrapFloppy2, bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'fac-home',
  standalone: true,
  imports: [CommonModule, MatIcon, NgIconComponent, MatButtonModule],
  providers: [
    provideIcons({
      bootstrapFloppy2,
      bootstrapGithub,
      bootstrapEyeglasses,
      bootstrapBook,
    }),
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
