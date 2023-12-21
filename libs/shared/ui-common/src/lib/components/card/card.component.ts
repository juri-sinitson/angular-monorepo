import { Component, Input } from '@angular/core';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'common-card',
  standalone: true,
  imports: [CardModule,],
  template: `
    <p-card [header]="header">
      <ng-content></ng-content>
    </p-card>
  `,  
})
export class CardComponent {
  @Input() header: string | undefined = undefined;
}
