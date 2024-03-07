import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'common-card',
  standalone: true,
  imports: [CardModule,],
  template: `
    <div class="mt-2">
      <p-card [header]="header()">
        <ng-content></ng-content>
      </p-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  header = input<string | undefined>(undefined);  
}
