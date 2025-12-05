import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
  bootstrapCoin,
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
  bootstrapSearch,
  bootstrapShieldLock,
  bootstrapUnlock,
  bootstrapWindowFullscreen,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { catchError, filter, map, Observable, shareReplay, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { VERSION } from '../../../version/version';
import { calculateDisplayVersion } from '../../../version/version.interface';
import { AppVersionComponent } from '../../dialogs/app-version/app-version.component';
import { LogoutDialogComponent } from '../../dialogs/logout-dialog/logout-dialog.component';
import { ADMIN_PERMISSIONS, Permissions } from '../../guards/permissions';
import { AppUpdateService } from '../../utils/app-update.service';
import { AuthService as AppAuthService } from '../../utils/auth.service';
import { DialogService } from '../../utils/dialog.service';

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
      bootstrapSearch,
      bootstrapCoin,
    }),
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnInit {
  private readonly dialog = inject(DialogService);
  private readonly titleService = inject(TitleStrategy);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly appAuthService = inject(AppAuthService);
  private readonly appUpdateService = inject(AppUpdateService);

  readonly Permissions = Permissions;
  readonly hasAdminPermissions$ = this.appAuthService.hasAnyPermission(...ADMIN_PERMISSIONS);

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

  ngOnInit(): void {
    this.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => !isAuthenticated),
        switchMap(() => this.auth.getAccessTokenSilently()),
        catchError((err) => {
          console.log('Error getting access token, user likely not logged in. Error was:', err);
          return [];
        }),
      )
      .subscribe();
  }

  login(): void {
    const loginMode = environment.loginMode;
    const login$ =
      loginMode === 'redirect'
        ? this.auth.loginWithRedirect({
            authorizationParams: { prompt: 'login' },
          })
        : this.auth.loginWithPopup({
            authorizationParams: { prompt: 'login' },
          });

    login$.pipe(switchMap(() => this.auth.user$)).subscribe({
      next: (user) => {
        this.dialog.success(`Welcome, ${user!.nickname}`);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.dialog.error('Whoops! Something about that login went sideways. Try again later.');
      },
    });
  }

  logout(): void {
    this.dialog.show(LogoutDialogComponent).subscribe((result) => {
      if (result) {
        this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
      }
    });
  }

  hasPermissions(permission: Permissions): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      shareReplay(1),
      switchMap((isAuthenticated) => (isAuthenticated ? this.appAuthService.hasPermission(permission) : [false])),
    );
  }

  onVersionClicked(): void {
    this.dialog.show(AppVersionComponent).subscribe();
  }
}
