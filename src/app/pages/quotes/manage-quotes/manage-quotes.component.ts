import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fac-manage-quotes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-quotes.component.html',
  styleUrl: './manage-quotes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageQuotesComponent {}
