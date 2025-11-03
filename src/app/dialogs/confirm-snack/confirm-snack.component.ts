import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { bootstrapCheck2Circle } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'fac-confirm-snack',
  standalone: true,
  imports: [MatIconModule, NgIconComponent],
  providers: [
    provideIcons({
      bootstrapCheck2Circle,
    }),
  ],
  templateUrl: './confirm-snack.component.html',
  styleUrl: './confirm-snack.component.scss',
})
export class ConfirmSnackComponent {
  readonly message: string = inject(MAT_SNACK_BAR_DATA);
}
