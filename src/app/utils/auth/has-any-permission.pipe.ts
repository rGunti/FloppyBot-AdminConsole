import { inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { Permissions } from '../../guards/permissions';
import { AuthService } from '../auth.service';

@Pipe({
  name: 'hasAnyPermission',
  standalone: true,
})
export class HasAnyPermissionPipe implements PipeTransform {
  private readonly authService = inject(AuthService);

  transform(permissions: (Permissions[] | Permissions) | readonly Permissions[]): Observable<boolean> {
    if (Array.isArray(permissions)) {
      return this.authService.hasAnyPermission(...permissions);
    }
    if (typeof permissions !== 'string') {
      return this.authService.hasAnyPermission(...permissions);
    }
    return this.authService.hasPermission(permissions);
  }
}
