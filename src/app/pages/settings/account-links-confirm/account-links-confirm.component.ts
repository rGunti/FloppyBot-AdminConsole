import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { bootstrapCheck2, bootstrapExclamationTriangle } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, filter, map, shareReplay, switchMap, take } from 'rxjs';

import { TwitchAuthenticationConfirm } from '../../../api/entities';
import { TwitchApiService } from '../../../api/twitch-api.service';

export interface AccountLinkStatus {
  status: 'InProgress' | 'Error' | 'Success';
  title: string;
  description: string;
}

@Component({
  selector: 'fac-account-links-confirm',
  imports: [CommonModule, MatProgressSpinner, MatCardModule, MatIcon, NgIconComponent, RouterLink, MatButton],
  providers: [
    provideIcons({
      bootstrapCheck2,
      bootstrapExclamationTriangle,
    }),
  ],
  templateUrl: './account-links-confirm.component.html',
  styleUrl: './account-links-confirm.component.scss',
})
export class AccountLinksConfirmComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly twitchApi = inject(TwitchApiService);

  private readonly statusSubject = new BehaviorSubject<AccountLinkStatus>({
    status: 'InProgress',
    title: 'Link in progress ...',
    description: 'One second, we are wrapping everything up ...',
  });

  private readonly queryParams$ = this.route.queryParamMap.pipe(shareReplay(1));

  readonly status$ = this.statusSubject.asObservable();
  readonly hasError$ = this.queryParams$.pipe(map((r) => r.has('error')));

  readonly confirmAction$ = this.queryParams$.pipe(
    take(1),
    filter((p) => {
      const hasResponse = p.has('code') && p.has('state');
      const hasError = p.has('error');
      if (hasError) {
        const errorCode = p.get('error');
        const errorDescription = p.get('error_description');
        this.statusSubject.next({
          status: 'Error',
          title: 'Link failed',
          description: `Your account could not be linked. Error ${errorCode}: ${errorDescription}`,
        });
        return false;
      }
      return hasResponse;
    }),
    map((p) => {
      const result: TwitchAuthenticationConfirm = {
        sessionId: p.get('state')!,
        code: p.get('code')!,
      };
      return result;
    }),
    switchMap((result) => this.twitchApi.confirmSession(result)),
  );

  ngOnInit(): void {
    console.log('Welcome back!');
    this.confirmAction$.subscribe({
      next: () => {
        this.statusSubject.next({
          status: 'Success',
          title: 'Link established',
          description: 'Your account has been linked successfully! Redirecting ...',
        });

        setTimeout(() => {
          this.router.navigate(['settings', 'account-links']);
        }, 2500);
      },
      error: (err) => {
        console.log('error', err);
        this.statusSubject.next({
          status: 'Error',
          title: 'Link failed',
          description: 'Something failed on our side.',
        });
      },
    });
  }
}

// https://id.twitch.tv/oauth2/authorize
// ?client_id=di2vuuvom3q3qlu4dvhvzktziagmkc
// &response_type=code
// &redirect_uri=http%3a%2f%2flocalhost%3a4200%2fsettings%2faccount-links-confirm
// &scope=
// &state=8de08e79-1302-464b-aee0-64c0a9b1fc3d
