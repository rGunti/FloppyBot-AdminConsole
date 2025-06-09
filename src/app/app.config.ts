import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { AuthHttpInterceptor, authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideNgIconsConfig, withContentSecurityPolicy } from '@ng-icons/core';

import { environment } from '../environments/environment';

import { errorInterceptor } from './interceptors/error.interceptor';
import { ChannelService } from './utils/channel/channel.service';
import { provideLocalStorageService } from './utils/local-storage';
import { FloppyBotTitleStrategy } from './utils/title-strategy';
import { routes } from './app.routes';

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
    provideHttpClient(withInterceptors([authHttpInterceptorFn, errorInterceptor])),
    provideAuth0({
      ...environment.auth,
      httpInterceptor: {
        allowedList: [`${environment.api}/*`],
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      skipRedirectCallback: window.location.pathname !== '/callback',
    }),
    // ChannelService should persist throughout the application to prevent deselection bugs
    ChannelService,
    AuthHttpInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    provideLocalStorageService(),
  ],
};
