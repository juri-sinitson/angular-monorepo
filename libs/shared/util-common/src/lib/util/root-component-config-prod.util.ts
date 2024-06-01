import { provideHttpClient } from '@angular/common/http';
import { 
  ApplicationConfig, 
  // Deactivate zoneless because it's not yes production ready.
  // provideExperimentalZonelessChangeDetection 
} from '@angular/core';
import { rootComponentConfigBase } from './root-component-config-base.util';

export const rootComponentConfigProd: ApplicationConfig = { 
  providers: [
    ...rootComponentConfigBase.providers,
    provideHttpClient(),
    // For now deactivated because it's not yet production ready.
    // TODO! Move to base config when stable.
    // Read the comments in the base config for more information.
    // provideExperimentalZonelessChangeDetection(),
  ],
}
