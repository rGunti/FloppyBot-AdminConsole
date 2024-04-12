import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

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
  //{
  //  path: 'settings',
  //  loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
  //},
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
