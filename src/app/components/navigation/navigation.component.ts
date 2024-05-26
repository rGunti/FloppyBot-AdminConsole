import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterModule, TitleStrategy } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import {
  bootstrapBugFill,
  bootstrapCaretLeft,
  bootstrapClockHistory,
  bootstrapCommand,
  bootstrapDoorOpen,
  bootstrapExclamationLg,
  bootstrapFileText,
  bootstrapFloppy2,
  bootstrapFolder2Open,
  bootstrapGear,
  bootstrapHouse,
  bootstrapLock,
  bootstrapMegaphone,
  bootstrapPencilSquare,
  bootstrapPersonCircle,
  bootstrapQuote,
  bootstrapShieldLock,
  bootstrapUnlock,
  bootstrapWindowFullscreen,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { filter, map, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { VERSION } from '../../../version/version';
import { calculateDisplayVersion } from '../../../version/version.interface';
import { AppVersionComponent } from '../../dialogs/app-version/app-version.component';
import { LogoutDialogComponent } from '../../dialogs/logout-dialog/logout-dialog.component';
import { ADMIN_PERMISSIONS, Permissions } from '../../guards/permissions';
import { AppUpdateService } from '../../utils/app-update.service';
import { HasAnyPermissionDirective } from '../../utils/auth/has-any-permission.directive';
import { HasAnyPermissionPipe } from '../../utils/auth/has-any-permission.pipe';
import { DialogService } from '../../utils/dialog.service';
import { ThemeButtonComponent } from '../theme-button/theme-button.component';

@Component({
  selector: 'fac-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIconComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule,
    ThemeButtonComponent,
    HasAnyPermissionPipe,
    HasAnyPermissionDirective,
  ],
  providers: [
    provideIcons({
      bootstrapFloppy2,
      bootstrapCommand,
      bootstrapQuote,
      bootstrapFolder2Open,
      bootstrapDoorOpen,
      bootstrapLock,
      bootstrapUnlock,
      bootstrapPersonCircle,
      bootstrapHouse,
      bootstrapBugFill,
      bootstrapCaretLeft,
      bootstrapGear,
      bootstrapWindowFullscreen,
      bootstrapMegaphone,
      bootstrapExclamationLg,
      bootstrapPencilSquare,
      bootstrapClockHistory,
      bootstrapFileText,
      bootstrapShieldLock,
    }),
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  private readonly dialog = inject(DialogService);
  private readonly titleService = inject(TitleStrategy);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly appUpdateService = inject(AppUpdateService);

  readonly Permissions = Permissions;
  readonly adminPermissions = ADMIN_PERMISSIONS;

  readonly debugFeaturesEnabled = environment.enableDebugTools;
  readonly version = calculateDisplayVersion(VERSION);
  readonly buildTime = VERSION.buildTime;

  readonly hasUpdates$ = this.appUpdateService.hasUpdates();

  readonly isAuthenticated$ = this.auth.isAuthenticated$;
  readonly username$ = this.auth.user$.pipe(map((user) => user?.nickname));
  readonly profilePictureUrl$ = this.auth.user$.pipe(map((user) => user?.picture));

  readonly title$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.routerState.snapshot),
    map((snapshot) => this.titleService.buildTitle(snapshot)),
  );

  login(): void {
    this.auth
      .loginWithPopup({
        authorizationParams: { prompt: 'login' },
      })
      .pipe(switchMap(() => this.auth.user$))
      .subscribe((user) => {
        this.dialog.success(`Welcome, ${user!.nickname}`);
      });
  }

  logout(): void {
    this.dialog.show(LogoutDialogComponent).subscribe((result) => {
      if (result) {
        this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
      }
    });
  }

  onReturnToV1(): void {
    this.dialog
      .ask(
        'Return to V1',
        'Would you like to return to the old version of the application? This will open the old version in a new tab.',
      )
      .pipe(filter((result) => result))
      .subscribe(() => {
        window.open('https://bot.floppypanda.ch', '_blank');
      });
  }

  onVersionClicked(): void {
    this.dialog.show(AppVersionComponent).subscribe();
  }
}
