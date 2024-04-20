import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { bootstrapBug } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'fac-not-implemented-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, NgIconComponent],
  providers: [provideIcons({ bootstrapBug })],
  templateUrl: './not-implemented-dialog.component.html',
  styleUrl: './not-implemented-dialog.component.scss',
})
export class NotImplementedDialogComponent {}
