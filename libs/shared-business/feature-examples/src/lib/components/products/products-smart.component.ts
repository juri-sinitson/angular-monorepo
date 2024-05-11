import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductEntityStoreService } from '@angular-monorepo/shared-business/examples';
import { ProductsComponent } from './products.component';


// TODO! Add the wrapper and add the 
// appropriate entries to storybook.
@Component({
  selector: 'angular-monorepo-products-smart',
  standalone: true,
  imports: [ProductsComponent],
  providers: [ProductEntityStoreService],
  template: `
    <div data-testid="products-feature">
      <angular-monorepo-products [data]="entityService.entities()"
        [isLoading]="!!entityService.isLoading()"
        [messages]="entityService.messages()"
        [noData]="entityService.noData()"
        [header]="'Products'"
        [crud]="true"        
        [selectedEntity]="entityService.selectedEntity()"        
        [isNewBeforeSubmitBeingEdited]="entityService.isNewEntityBeingEdited()"
        [isError]="entityService.isError()"
        (onNew)="entityService.addEntity($event)"
        (onNewBeforeSubmit)="entityService.selectUncreatedEntity()"
        (onUpdate)="entityService.updateEntity($event)"
        (onDelete)="entityService.deleteEntity($event)"
        (onEdit)="entityService.selectEntityId($event)"
        (onCancel)="entityService.resetSelectedEntity()"

      >
      </angular-monorepo-products>
    </div>
  `,  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSmartComponent {
  entityService = inject(ProductEntityStoreService);
}
