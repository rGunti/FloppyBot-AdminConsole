import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { AuthModule } from '@auth0/auth0-angular';
import { provideNgIconsConfig, withContentSecurityPolicy } from '@ng-icons/core';

import { environment } from '../environments/environment';

import { fakeDataInterceptor } from './interceptors/fake-data.interceptor';
import { loadingIndicatorInterceptor } from './interceptors/loading-indicator.interceptor';
import { ChannelService } from './utils/channel/channel.service';
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
    provideHttpClient(withInterceptors([loadingIndicatorInterceptor, fakeDataInterceptor])),
    importProvidersFrom(
      AuthModule.forRoot({
        ...environment.auth,
      }),
    ),
    // ChannelService should persist throughout the application to prevent deselection bugs
    ChannelService,
  ],
};
