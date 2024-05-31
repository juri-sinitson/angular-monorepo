import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { rootComponentConfigBase } from './root-component-config-base.util';

export const rootComponentConfigProd: ApplicationConfig = { 
  providers: [
    ...rootComponentConfigBase.providers,
    provideHttpClient(),
    // TODO! Move to base config when stable.
    // Read the comments in the base config for more information.
    provideExperimentalZonelessChangeDetection(),
  ],
}
