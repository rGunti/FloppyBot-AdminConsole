import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '../utils/auth.service';

import { Permissions } from './permissions';

export function hasAnyPermission(...permissions: Permissions[]): CanActivateFn {
  return () => inject(AuthService).hasAnyPermission(...permissions);
}

export function hasAllPermissions(...permissions: Permissions[]): CanActivateFn {
  return () => inject(AuthService).hasAllPermissions(...permissions);
}
