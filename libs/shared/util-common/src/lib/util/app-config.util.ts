import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const commonAppConfig: ApplicationConfig = { 
  providers: [
    provideAnimations(),
    provideHttpClient(),
  ],
}