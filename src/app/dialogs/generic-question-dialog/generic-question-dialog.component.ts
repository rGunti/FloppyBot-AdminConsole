import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface GenericQuestionDialogData {
  title: string;
  content: string;
  isYesDangerous?: boolean;
}

@Component({
  selector: 'fac-generic-question-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './generic-question-dialog.component.html',
  styleUrl: './generic-question-dialog.component.scss',
})
export class GenericQuestionDialogComponent {
  readonly data: GenericQuestionDialogData = inject(MAT_DIALOG_DATA);
}
