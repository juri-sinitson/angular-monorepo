import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';

// TODO: Add tags to libs
// eslint-disable-next-line @nx/enforce-module-boundaries
import { commonAppConfig } from '@angular-monorepo/shared/util-common';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    ...commonAppConfig.providers,
    importProvidersFrom(HttpClientModule),    
  ],
};
