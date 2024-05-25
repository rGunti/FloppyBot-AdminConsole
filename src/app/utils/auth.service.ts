import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay } from 'rxjs';

import { UserApiService } from '../api/user-api.service';
import { Permissions } from '../guards/permissions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserApiService);
  private readonly user$ = this.userService.getMe().pipe(shareReplay(1));
  private readonly permissions$ = this.user$.pipe(
    map((user) => user.permissions),
    catchError(() => []),
  );

  hasPermission(permission: Permissions): Observable<boolean> {
    return this.permissions$.pipe(
      map((permissions) => permissions.includes(permission)),
      catchError(() => [false]),
    );
  }

  hasAnyPermission(...permissions: readonly Permissions[]): Observable<boolean> {
    return this.permissions$.pipe(
      map((userPermissions) => permissions.some((permission) => userPermissions.includes(permission))),
      catchError(() => [false]),
    );
  }

  hasAllPermissions(...permissions: readonly Permissions[]): Observable<boolean> {
    return this.permissions$.pipe(
      map((userPermissions) => permissions.every((permission) => userPermissions.includes(permission))),
    );
  }
}
