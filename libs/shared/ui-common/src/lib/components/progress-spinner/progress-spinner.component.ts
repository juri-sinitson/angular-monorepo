import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinnerComponent {
  loadingMessage = input<string>('');
}
