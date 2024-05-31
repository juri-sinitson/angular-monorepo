import { TestModuleMetadata } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const specConfig: TestModuleMetadata = {
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideExperimentalZonelessChangeDetection(),
  ]
}
