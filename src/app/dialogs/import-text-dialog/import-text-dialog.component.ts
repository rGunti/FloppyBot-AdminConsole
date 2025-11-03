import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export class ImportTextDialogData {
  constructor(
    public title: string,
    public placeholder: string,
  ) {}
}

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormField, MatInput],
  templateUrl: './import-text-dialog.component.html',
  styleUrl: './import-text-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportTextDialogComponent {
  readonly dialogData: ImportTextDialogData =
    inject(MAT_DIALOG_DATA) || new ImportTextDialogData('Import data', 'Enter the data to be imported below:');
}
