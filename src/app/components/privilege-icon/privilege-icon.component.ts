import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  bootstrapPerson,
  bootstrapShield,
  bootstrapShieldFill,
  bootstrapShieldLockFill,
  bootstrapShieldShaded,
  bootstrapShieldSlash,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { PrivilegeLevel } from '../../api/entities';

@Component({
  selector: 'fac-privilege-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgIconComponent, MatTooltipModule],
  providers: [
    provideIcons({
      bootstrapShieldLockFill,
      bootstrapShieldFill,
      bootstrapShieldShaded,
      bootstrapShield,
      bootstrapPerson,
      bootstrapShieldSlash,
    }),
  ],
  templateUrl: './privilege-icon.component.html',
  styleUrl: './privilege-icon.component.scss',
})
export class PrivilegeIconComponent {
  @Input({ required: true }) privilege!: PrivilegeLevel;
  @Input() tooltip = true;

  get icon(): string {
    switch (this.privilege) {
      case 'Unknown':
        return 'bootstrapShieldSlash';
      case 'Viewer':
        return 'bootstrapShield';
      case 'Moderator':
        return 'bootstrapShieldShaded';
      case 'Administrator':
        return 'bootstrapShieldFill';
      case 'SuperUser':
        return 'bootstrapShieldLockFill';
      default:
        return '';
    }
  }
}
