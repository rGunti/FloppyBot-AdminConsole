import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
  bootstrapBox,
  bootstrapClock,
  bootstrapHash,
  bootstrapKey,
  bootstrapMailboxFlag,
  bootstrapPersonCircle,
  bootstrapPersonFill,
  bootstrapShieldCheck,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { map, shareReplay } from 'rxjs';

import { UserApiService } from '../../api/user-api.service';
import { ChannelAliasPipe } from '../../utils/channel/channel-alias.pipe';

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
    }),
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly userApi = inject(UserApiService);

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

  ngOnInit(): void {
    this.userForm$.subscribe((user) => {
      this.form.patchValue(user);
    });
  }
}
