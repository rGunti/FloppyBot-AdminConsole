import { ApplicationConfig } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNgIconsConfig, withContentSecurityPolicy } from '@ng-icons/core';
import { FloppyBotTitleStrategy } from './utils/title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNgIconsConfig({}, withContentSecurityPolicy()),
    {
      provide: TitleStrategy,
      useClass: FloppyBotTitleStrategy,
    },
  ],
};
