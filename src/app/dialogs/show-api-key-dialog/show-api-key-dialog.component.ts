import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapCopy } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { ApiKeyReport } from '../../api/entities';
import { DialogService } from '../../utils/dialog.service';

@Component({
  selector: 'fac-show-api-key-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    NgIconComponent,
    ClipboardModule,
  ],
  providers: [
    provideIcons({
      bootstrapCopy,
    }),
  ],
  templateUrl: './show-api-key-dialog.component.html',
  styleUrl: './show-api-key-dialog.component.scss',
})
export class ShowApiKeyDialogComponent {
  readonly report: ApiKeyReport = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(DialogService);

  showCopiedTooltip(): void {
    this.dialog.success('API key copied to clipboard');
  }
}
