import { ApplicationConfig } from '@angular/core';

// TODO: Add tags to libs
// eslint-disable-next-line @nx/enforce-module-boundaries
import { rootComponentConfigProd as commonAppConfig } from '@angular-monorepo/shared/util-common';

export const appConfig: ApplicationConfig = {
  providers: [
    ...commonAppConfig.providers,
  ],
};
