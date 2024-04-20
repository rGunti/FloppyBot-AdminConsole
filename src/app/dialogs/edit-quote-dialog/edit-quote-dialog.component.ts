import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Quote } from '../../api/entities';

@Component({
  selector: 'fac-edit-quote-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './edit-quote-dialog.component.html',
  styleUrl: './edit-quote-dialog.component.scss',
})
export class EditQuoteDialogComponent {
  readonly formBuilder = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<EditQuoteDialogComponent>);
  readonly form = this.formBuilder.group({
    id: this.formBuilder.control(
      {
        value: '',
        disabled: true,
      },
      [Validators.required],
    ),
    channelId: this.formBuilder.control(
      {
        value: '',
        disabled: true,
      },
      [Validators.required],
    ),
    quoteId: this.formBuilder.control(
      {
        value: 0,
        disabled: true,
      },
      [Validators.required],
    ),
    quoteText: this.formBuilder.control(
      {
        value: '',
        disabled: false,
      },
      [Validators.required],
    ),
    quoteContext: this.formBuilder.control(
      {
        value: '',
        disabled: false,
      },
      [Validators.required],
    ),
    createdAt: this.formBuilder.control(
      {
        value: new Date(),
        disabled: true,
      },
      [Validators.required],
    ),
    createdBy: this.formBuilder.control(
      {
        value: '',
        disabled: true,
      },
      [Validators.required],
    ),
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: Quote) {
    this.form.patchValue(data);
  }

  saveQuote(): void {
    this.dialogRef.close(this.form.value);
  }
}
