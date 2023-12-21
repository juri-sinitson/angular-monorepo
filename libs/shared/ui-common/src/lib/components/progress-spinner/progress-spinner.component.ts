import { Component, Input } from '@angular/core';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'common-progress-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    <p-progressSpinner></p-progressSpinner>
    @if(loadingMessage) {
      <p>{{loadingMessage}}...</p>
    }
  `,
})
export class ProgressSpinnerComponent {
  @Input() loadingMessage = '';
}
