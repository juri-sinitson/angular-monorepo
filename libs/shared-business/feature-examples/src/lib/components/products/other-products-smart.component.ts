import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// TODO: Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OtherProductEntityStoreService } from '@angular-monorepo/shared-business/examples';
import { ProductsComponent } from './products.component';

/**
 * Created on the fast track for E2E testing demo purposes.
 * One of the goals is to demonstrate E2E testing 
 * of a page with multiple API calls.
 * 
 * TODO: Try to DRY this service e.g. by inheritance.
 */
@Component({
  selector: 'angular-monorepo-other-products-smart',
  standalone: true,
  imports: [ProductsComponent],
  providers: [OtherProductEntityStoreService],
  template: `
    <div data-testid="other-products-feature">
      <angular-monorepo-products [data]="entityService.entities()"
        [isLoading]="!!entityService.isLoading()"
        [messages]="entityService.messages()"
        [noData]="entityService.noData()"
        [header]="'Other Products'"
      >
      </angular-monorepo-products>
    </div>
  `,  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherProductsSmartComponent {
  entityService = inject(OtherProductEntityStoreService);
}
