import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  bootstrapDiscord,
  bootstrapPerson,
  bootstrapShield,
  bootstrapShieldFill,
  bootstrapShieldLockFill,
  bootstrapShieldShaded,
  bootstrapTwitch,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { CommandInfo } from '../../api/entities';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'fac-command-restrictions',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgIconComponent, MatTooltipModule],
  providers: [
    provideIcons({
      bootstrapDiscord,
      bootstrapTwitch,
      bootstrapShieldLockFill,
      bootstrapShieldFill,
      bootstrapShieldShaded,
      bootstrapShield,
      bootstrapPerson,
    }),
  ],
  templateUrl: './command-restrictions.component.html',
  styleUrl: './command-restrictions.component.scss',
})
export class CommandRestrictionsComponent {
  @Input({ required: true }) command!: CommandInfo;

  get hasPrivilegeRestrictions(): boolean {
    return !!this.command.requiredPrivilegeLevel && this.command.requiredPrivilegeLevel !== 'Unknown';
  }

  get privilegeIcon(): string {
    switch (this.command.requiredPrivilegeLevel) {
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

  get privilegeRestrictionTooltip(): string {
    const upSuffix = this.command.requiredPrivilegeLevel === 'SuperUser' ? '' : ' and up';
    return `Restricted to ${this.command.requiredPrivilegeLevel}${upSuffix}`;
  }

  get hasInterfaceRestrictions(): boolean {
    return this.command.restrictedToInterfaces.length > 0;
  }

  get isRestrictedToTwitch(): boolean {
    return this.command.restrictedToInterfaces.includes('Twitch');
  }

  get isRestrictedToDiscord(): boolean {
    return this.command.restrictedToInterfaces.includes('Discord');
  }
}
