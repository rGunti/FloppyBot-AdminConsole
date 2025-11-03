import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { bootstrapChatRightQuote, bootstrapController, bootstrapPerson } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { Quote } from '../../api/entities';

@Component({
  selector: 'fac-edit-quote-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      bootstrapChatRightQuote,
      bootstrapController,
      bootstrapPerson,
    }),
    DatePipe,
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
    channelMappingId: this.formBuilder.control(
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
      [],
    ),
    createdAt: this.formBuilder.control(
      {
        value: new Date(),
        disabled: false,
      },
      [Validators.required],
    ),
    createdBy: this.formBuilder.control(
      {
        value: '',
        disabled: false,
      },
      [Validators.required],
    ),
  });

  constructor() {
    const data = inject<Quote>(MAT_DIALOG_DATA);

    this.form.patchValue(data);
  }

  saveQuote(): void {
    this.dialogRef.close(this.form.value);
  }
}
