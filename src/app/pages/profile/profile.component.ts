import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  bootstrapPersonCircle,
  bootstrapShieldCheck,
  bootstrapKey,
  bootstrapBox,
  bootstrapPersonFill,
  bootstrapHash,
  bootstrapMailboxFlag,
  bootstrapClock,
} from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'fac-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    ReactiveFormsModule,
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      bootstrapPersonCircle,
      bootstrapShieldCheck,
      bootstrapKey,
      bootstrapBox,
      bootstrapPersonFill,
      bootstrapHash,
      bootstrapMailboxFlag,
      bootstrapClock,
    }),
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly form = this.formBuilder.group({
    username: [''],
    userId: [''],
    email: [''],
    updated: [new Date()],
  });
}