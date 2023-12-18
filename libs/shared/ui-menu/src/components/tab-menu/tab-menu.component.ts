import { Component, Input } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';

import { MenuItemInterface } from '../../interfaces/menu-item.interface';

/**
 * A horizontal tab menu. Based on PrimeNG TabMenu.
 */
@Component({
  selector: 'menu-tab-menu',
  standalone: true,
  imports: [TabMenuModule],
  template: `
    <p-tabMenu [model]="items" [activeItem]="items[0]">
      <ng-template pTemplate="item" let-item>
        <a
          class="p-menuitem-link flex justify-content-between align-items-center p-3"
          [attr.data-testid]="'link' + item.url"
          [routerLink]="item.url"
          [routerLinkActive]="'active'"
        >
          <div>
            @if (showIcons) {
              <span [class]="item.icon"></span>
            }
            @if (showLabels) {
              <span> {{ item.label }}</span>
            }            
          </div>
        </a>
      </ng-template>
    </p-tabMenu>
  `,
})
export class TabMenuComponent {
  @Input() items: MenuItemInterface[] = [];  
  @Input() showLabels = true;
  @Input() showIcons = true;
}
