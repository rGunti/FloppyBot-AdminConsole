import { Injectable } from '@angular/core';
import {
  bootstrapShield,
  bootstrapShieldFill,
  bootstrapShieldLockFill,
  bootstrapShieldShaded,
  bootstrapShieldSlash,
} from '@ng-icons/bootstrap-icons';

import { PrivilegeLevel } from '../api/entities';

@Injectable({
  providedIn: 'root',
})
export class PrivilegeService {
  readonly privileges: PrivilegeLevel[] = ['Administrator', 'Moderator', 'Viewer', 'Unknown'] as const;
  readonly privilegeItems = this.privileges.map((privilege) => ({
    privilege,
    label: this.getPrivilegeLabel(privilege),
    icon: this.getPrivilegeIconSvg(privilege),
  }));

  getPrivilegeIconSvg(privilege: PrivilegeLevel): string {
    switch (privilege) {
      case 'Unknown':
        return bootstrapShieldSlash;
      case 'Viewer':
        return bootstrapShield;
      case 'Moderator':
        return bootstrapShieldShaded;
      case 'Administrator':
        return bootstrapShieldFill;
      case 'SuperUser':
        return bootstrapShieldLockFill;
      default:
        return '';
    }
  }

  getPrivilegeLabel(privilege: PrivilegeLevel): string {
    switch (privilege) {
      case 'Unknown':
        return 'Unknown';
      case 'Viewer':
        return 'Viewer';
      case 'Moderator':
        return 'Moderator';
      case 'Administrator':
        return 'Administrator';
      case 'SuperUser':
        return 'Super User';
      default:
        return '';
    }
  }
}
