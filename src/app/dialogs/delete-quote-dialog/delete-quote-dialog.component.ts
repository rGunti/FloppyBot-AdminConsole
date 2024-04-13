import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { Quote } from '../../api/entities';

@Component({
  selector: 'fac-delete-quote-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-quote-dialog.component.html',
  styleUrl: './delete-quote-dialog.component.scss',
})
export class DeleteQuoteDialogComponent {
  readonly quote: Quote = inject(MAT_DIALOG_DATA);
}
