import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule, TitleStrategy } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  bootstrapFloppy2,
  bootstrapCommand,
  bootstrapQuote,
  bootstrapFolder2Open,
  bootstrapLock,
  bootstrapUnlock,
  bootstrapPersonCircle,
  bootstrapHouse,
} from '@ng-icons/bootstrap-icons';
import { LogoutDialogComponent } from '../../dialogs/logout-dialog/logout-dialog.component';
import { filter, map } from 'rxjs';

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
      bootstrapLock,
      bootstrapUnlock,
      bootstrapPersonCircle,
      bootstrapHouse,
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

  title$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.routerState.snapshot),
    map((snapshot) => this.titleService.buildTitle(snapshot)),
  );

  logout(): void {
    this.dialog.open(LogoutDialogComponent);
  }
}
