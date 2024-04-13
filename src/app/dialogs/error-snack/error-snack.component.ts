import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { bootstrapXCircle } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'fac-error-snack',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButton, NgIconComponent],
  providers: [
    provideIcons({
      bootstrapXCircle,
    }),
  ],
  templateUrl: './error-snack.component.html',
  styleUrl: './error-snack.component.scss',
})
export class ErrorSnackComponent {
  readonly message: string = inject(MAT_SNACK_BAR_DATA);
  readonly snackBarRef = inject(MatSnackBarRef);
}
