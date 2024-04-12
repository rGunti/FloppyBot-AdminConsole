import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterModule, TitleStrategy } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import {
  bootstrapBugFill,
  bootstrapCommand,
  bootstrapDoorOpen,
  bootstrapFloppy2,
  bootstrapFolder2Open,
  bootstrapHouse,
  bootstrapLock,
  bootstrapPersonCircle,
  bootstrapQuote,
  bootstrapUnlock,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { filter, map } from 'rxjs';

import { LogoutDialogComponent } from '../../dialogs/logout-dialog/logout-dialog.component';

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
    }),
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  private readonly dialog = inject(MatDialog);
  private readonly titleService = inject(TitleStrategy);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly isAuthenticated$ = this.auth.isAuthenticated$;
  readonly username$ = this.auth.user$.pipe(map((user) => user?.nickname));
  readonly profilePictureUrl$ = this.auth.user$.pipe(map((user) => user?.picture));

  title$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.routerState.snapshot),
    map((snapshot) => this.titleService.buildTitle(snapshot)),
  );

  login(): void {
    this.auth.loginWithPopup({
      authorizationParams: { prompt: 'login' },
    });
  }

  logout(): void {
    this.dialog
      .open(LogoutDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
        }
      });
  }
}
