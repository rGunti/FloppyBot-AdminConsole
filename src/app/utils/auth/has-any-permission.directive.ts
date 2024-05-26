import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';

import { Permissions } from '../../guards/permissions';
import { AuthService } from '../auth.service';

@Directive({
  selector: '[facHasAnyPermission]',
  standalone: true,
})
export class HasAnyPermissionDirective {
  private readonly authService = inject(AuthService);

  private readonly template = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  private permissions: (Permissions[] | Permissions) | readonly Permissions[] = [] as const;

  @Input({ required: true }) set facHasAnyPermission(
    permissions: (Permissions[] | Permissions) | readonly Permissions[],
  ) {
    this.permissions = permissions;
    this.render();
  }

  private render(): void {
    this.checkPermission(this.permissions).subscribe((hasRole) => {
      if (hasRole) {
        this.viewContainer.createEmbeddedView(this.template);
      } else {
        this.viewContainer.clear();
      }
    });
  }

  private checkPermission(permissions: (Permissions[] | Permissions) | readonly Permissions[]): Observable<boolean> {
    if (Array.isArray(permissions)) {
      return this.authService.hasAnyPermission(...permissions);
    }
    if (typeof permissions !== 'string') {
      return this.authService.hasAnyPermission(...permissions);
    }
    return this.authService.hasPermission(permissions);
  }
}
