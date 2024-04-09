import { ApplicationConfig, isDevMode } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNgIconsConfig, withContentSecurityPolicy } from '@ng-icons/core';
import { FloppyBotTitleStrategy } from './utils/title-strategy';
import { provideServiceWorker } from '@angular/service-worker';

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
  ],
};
