import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

import { hasAnyPermission } from './guards/auth-role.guard';
import { ADMIN_PERMISSIONS, Permissions } from './guards/permissions';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'callback',
    title: 'Login',
    loadComponent: () => import('./pages/callback/callback.component').then((m) => m.CallbackComponent),
  },
  {
    path: 'commands',
    children: [
      {
        path: 'built-in',
        title: 'Built-in Commands',
        loadComponent: () =>
          import('./pages/commands/built-in-commands/built-in-commands.component').then(
            (m) => m.BuiltInCommandsComponent,
          ),
      },
      {
        path: 'custom',
        title: 'Custom Commands',
        loadComponent: () =>
          import('./pages/commands/custom-commands/custom-commands.component').then((m) => m.CustomCommandsComponent),
      },
      {
        path: 'shoutout',
        title: 'Shoutout',
        loadComponent: () => import('./pages/commands/shoutout/shoutout.component').then((m) => m.ShoutoutComponent),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'quotes',
    children: [
      {
        path: 'manage',
        title: 'Manage Quotes',
        loadComponent: () =>
          import('./pages/quotes/manage-quotes/manage-quotes.component').then((m) => m.ManageQuotesComponent),
      },
      {
        path: 'export',
        title: 'Export Quotes',
        loadComponent: () =>
          import('./pages/quotes/export-quotes/export-quotes.component').then((m) => m.ExportQuotesComponent),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'files',
    children: [
      {
        path: 'manage',
        title: 'Manage Files',
        loadComponent: () =>
          import('./pages/files/manage-files/manage-files.component').then((m) => m.ManageFilesComponent),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'debug',
    title: 'Debug',
    loadComponent: () => import('./pages/debug/debug.component').then((m) => m.DebugComponent),
  },
  {
    path: 'settings',
    title: 'Settings',
    children: [
      {
        path: 'channel-aliases',
        title: 'Settings / Channel Aliases',
        loadComponent: () =>
          import('./pages/settings/channel-aliases/channel-aliases.component').then((m) => m.ChannelAliasesComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'account-links',
        title: 'Settings / Account Links',
        loadComponent: () =>
          import('./pages/settings/account-links/account-links.component').then((m) => m.AccountLinksComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'account-links/confirm',
        loadComponent: () =>
          import('./pages/settings/account-links-confirm/account-links-confirm.component').then(
            (m) => m.AccountLinksConfirmComponent,
          ),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'stream-source',
    title: 'Stream Source',
    children: [
      {
        path: 'show-url',
        title: 'Stream Source / Copy Link',
        loadComponent: () =>
          import('./pages/stream-source/show-url/show-url.component').then((m) => m.ShowUrlComponent),
      },
    ],
  },
  {
    path: 'timer',
    title: 'Timer Messages',
    loadComponent: () => import('./pages/commands/timer/timer.component').then((m) => m.TimerComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    title: 'Admin',
    children: [
      {
        path: 'logs',
        title: 'Logs',
        loadComponent: () => import('./pages/admin/logs/logs.component').then((m) => m.LogsComponent),
        canActivate: [AuthGuard, hasAnyPermission(Permissions.ReadLogs)],
      },
      {
        path: 'audit',
        title: 'Audit Logs',
        loadComponent: () => import('./pages/admin/audit/audit.component').then((m) => m.AuditComponent),
        canActivate: [AuthGuard, hasAnyPermission(Permissions.ReadAudit)],
      },
    ],
    canActivate: [AuthGuard, hasAnyPermission(...ADMIN_PERMISSIONS)],
  },
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
