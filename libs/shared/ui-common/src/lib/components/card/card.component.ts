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
  private _header: string  = '';
  
  @Input() set header(header: string) {
    this._header = header;
  }

  get header(): string | undefined {
    return this._header ? this._header : undefined;
  }
}
