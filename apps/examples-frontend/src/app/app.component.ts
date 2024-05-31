import { ChangeDetectionStrategy, Component } from '@angular/core';

// TODO: Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { 
  ProductsSmartComponent, 
  OtherProductsSmartComponent 
} from '@angular-monorepo/shared-business/feature-examples';

@Component({
  standalone: true,
  imports: [ProductsSmartComponent, OtherProductsSmartComponent],
  selector: 'angular-monorepo-root',
  template: `    
    <angular-monorepo-products-smart></angular-monorepo-products-smart>    
    <angular-monorepo-other-products-smart></angular-monorepo-other-products-smart>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
