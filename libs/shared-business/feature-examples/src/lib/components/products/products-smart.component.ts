import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductService } from '@angular-monorepo/shared-business/examples';
import { ProductsComponent } from './products.component';


// TODO! Add the wrapper and add the 
// appropriate entries to storybook.
@Component({
  selector: 'angular-monorepo-products-smart',
  standalone: true,
  imports: [ProductsComponent],
  providers: [ProductService],
  template: `
    <div data-testid="products-feature">
      <angular-monorepo-products [data]="productService.products()"
        [isLoading]="!!productService.isLoading()"
        [messages]="productService.messages()"
        [noData]="productService.noData()"
        [header]="'Products'"
      >
      </angular-monorepo-products>
    </div>
  `,  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSmartComponent {
  productService = inject(ProductService);
}
