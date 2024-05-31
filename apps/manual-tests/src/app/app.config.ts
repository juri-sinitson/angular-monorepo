import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

// TODO: Add tags to libs
// eslint-disable-next-line @nx/enforce-module-boundaries
import { rootComponentConfigProd as commonAppConfig } from '@angular-monorepo/shared/util-common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    ...commonAppConfig.providers,
  ],
};
