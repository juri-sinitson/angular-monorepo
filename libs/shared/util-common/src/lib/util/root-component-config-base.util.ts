import { 
  ApplicationConfig, 
  // Uncomment again when the feature is stable.
  // provideExperimentalZonelessChangeDetection 
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const rootComponentConfigBase: ApplicationConfig = { 
  providers: [
    provideAnimations(),    
    // Uncomment again when the feature is stable.
    // Currently (2024-06-03) the the storybook test framework can't find the 
    // message container although it is rendered. So the 
    // error stories will fail although rendered correctly.    
    // provideExperimentalZonelessChangeDetection(),
  ],
}
