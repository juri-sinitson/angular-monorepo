import { ApplicationConfig } from '@angular/core';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { rootComponentConfigProd } from '@angular-monorepo/shared/util-common';

export const appConfig: ApplicationConfig = {
  providers: [
    ...rootComponentConfigProd.providers,
  ],
};
