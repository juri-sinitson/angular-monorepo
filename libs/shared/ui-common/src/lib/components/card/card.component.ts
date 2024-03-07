import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'common-card',
  standalone: true,
  imports: [CardModule,],
  template: `
    <p-card [header]="header()">
      <ng-content></ng-content>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  header = input<string | undefined>(undefined);  
}
