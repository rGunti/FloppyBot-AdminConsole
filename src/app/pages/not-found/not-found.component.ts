import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { bootstrapQuestionDiamond } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'fac-not-found',
  standalone: true,
  imports: [MatIconModule, NgIconComponent],
  providers: [
    provideIcons({
      bootstrapQuestionDiamond,
    }),
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
