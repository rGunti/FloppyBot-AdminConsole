import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '@auth0/auth0-angular';
import {
  bootstrapArrowCounterclockwise,
  bootstrapBox,
  bootstrapClock,
  bootstrapEye,
  bootstrapHash,
  bootstrapKey,
  bootstrapMailboxFlag,
  bootstrapPersonCircle,
  bootstrapPersonFill,
  bootstrapShieldCheck,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { filter, map, of, shareReplay, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { UserApiService } from '../../api/user-api.service';
import { RegenerateApiKeyDialogComponent } from '../../dialogs/regenerate-api-key-dialog/regenerate-api-key-dialog.component';
import { ShowApiKeyDialogComponent } from '../../dialogs/show-api-key-dialog/show-api-key-dialog.component';
import { ChannelAliasPipe } from '../../utils/channel/channel-alias.pipe';
import { DialogService } from '../../utils/dialog.service';

@Component({
  selector: 'fac-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    ReactiveFormsModule,
    NgIconComponent,
    ChannelAliasPipe,
  ],
  providers: [
    provideIcons({
      bootstrapPersonCircle,
      bootstrapShieldCheck,
      bootstrapKey,
      bootstrapBox,
      bootstrapPersonFill,
      bootstrapHash,
      bootstrapMailboxFlag,
      bootstrapClock,
      bootstrapEye,
      bootstrapArrowCounterclockwise,
    }),
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly auth = inject(AuthService);
  private readonly userApi = inject(UserApiService);
  private readonly dialog = inject(DialogService);

  private readonly formBuilder = inject(FormBuilder);
  readonly form = this.formBuilder.group({
    username: [''],
    userId: [''],
    email: [''],
    updated: [new Date()],
  });

  readonly currentUser$ = this.auth.user$.pipe(shareReplay(1));
  readonly profilePictureStyle$ = this.currentUser$.pipe(
    map((user) => user?.picture),
    map((url) => {
      if (!url) {
        return undefined;
      }

      return {
        'background-size': 'cover',
        'background-image': `url(${url})`,
      };
    }),
  );
  readonly userForm$ = this.currentUser$.pipe(
    takeUntil(this.destroy$),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map((user: any) => {
      return {
        username: user.nickname,
        userId: user.sub,
        email: user.email,
        updated: user.updated_at,
      };
    }),
  );

  readonly userInfo$ = this.userApi.getMe().pipe(shareReplay(1));
  readonly accessibleChannels$ = this.userInfo$.pipe(map((user) => user.ownerOf));
  readonly channelAliases$ = this.userInfo$.pipe(map((user) => user.channelAliases));
  readonly permissions$ = this.userInfo$.pipe(map((user) => user.permissions));

  readonly apiKeyCreatedAt$ = this.userInfo$.pipe(map((user) => user.apiKeyCreatedAt));
  readonly apiKeyFunctionsDisabled$ = this.apiKeyCreatedAt$.pipe(map((apiKeyCreatedAt) => !apiKeyCreatedAt));

  ngOnInit(): void {
    this.userForm$.subscribe((user) => {
      this.form.patchValue(user);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  revealAccessKey(): void {
    this.userApi
      .getAccessKey()
      .pipe(switchMap((report) => this.dialog.show(ShowApiKeyDialogComponent, report)))
      .subscribe();
  }

  regenerateAccessKey(firstTime: boolean): void {
    const confirm = firstTime ? of(true) : this.dialog.show(RegenerateApiKeyDialogComponent, undefined);
    confirm
      .pipe(
        takeUntil(this.destroy$),
        filter((confirmed) => !!confirmed),
        switchMap(() => this.userApi.regenerateAccessKey()),
        tap(() => this.dialog.success('API key generated successfully')),
      )
      .subscribe(() => {
        this.revealAccessKey();
      });
  }
}
