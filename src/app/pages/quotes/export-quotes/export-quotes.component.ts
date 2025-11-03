import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fac-export-quotes',
  standalone: true,
  imports: [],
  templateUrl: './export-quotes.component.html',
  styleUrl: './export-quotes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportQuotesComponent {}
