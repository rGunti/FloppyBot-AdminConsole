import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNgIconsConfig, withContentSecurityPolicy } from '@ng-icons/core';
import { FloppyBotTitleStrategy } from './utils/title-strategy';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingIndicatorInterceptor } from './interceptors/loading-indicator.interceptor';
import { AuthModule } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNgIconsConfig({}, withContentSecurityPolicy()),
    {
      provide: TitleStrategy,
      useClass: FloppyBotTitleStrategy,
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideHttpClient(withInterceptors([loadingIndicatorInterceptor])),
    importProvidersFrom(
      AuthModule.forRoot({
        domain: 'floppypanda-dev.eu.auth0.com',
        clientId: '0K1HDg7wVjHo9l0d17BmxK9zTCui3NJ6',
        //audience: 'https://bot.floppypanda.test',
        authorizationParams: {
          redirect_uri: 'http://localhost:4200/callback',
        },
        errorPath: '/callback',
      }),
    ),
  ],
};
