import { Routes } from '@angular/router';

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
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
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
