import { ApplicationConfig } from '@angular/core';

// This is an exception where we need a non-feature library.
// Other that that the app should only depend on feature libraries.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { rootComponentConfigProd } from '@angular-monorepo/shared/util-common';

export const appConfig: ApplicationConfig = {
  providers: [
    ...rootComponentConfigProd.providers,
  ],
};
