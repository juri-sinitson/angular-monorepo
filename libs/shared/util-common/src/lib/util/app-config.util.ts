import { HttpClientModule } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const commonAppConfig: ApplicationConfig = { 
  providers: [
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
  ],
}