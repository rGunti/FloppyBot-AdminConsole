import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'fac-regenerate-api-key-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './regenerate-api-key-dialog.component.html',
  styleUrl: './regenerate-api-key-dialog.component.scss',
})
export class RegenerateApiKeyDialogComponent {}
