import { Component, input } from '@angular/core';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'common-progress-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    <p-progressSpinner></p-progressSpinner>
    @if(loadingMessage()) {
      <p data-testid="loadingMessage">{{loadingMessage()}}...</p>
    }
  `,
})
export class ProgressSpinnerComponent {
  loadingMessage = input<string>('');
}
