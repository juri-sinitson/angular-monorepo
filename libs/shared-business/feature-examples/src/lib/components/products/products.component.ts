import { ChangeDetectionStrategy, Component } from '@angular/core';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { 
  BasicTableComponent,
  CommonWrapperComponent,
} from '@angular-monorepo/shared/ui-common';
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AbstractEntitiesListComponent } from '@angular-monorepo/shared/ui-common';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface } from '@angular-monorepo/shared-business/examples';

@Component({
  selector: 'angular-monorepo-products',
  standalone: true,
  imports: [BasicTableComponent, CommonWrapperComponent],
  template: `
    <common-common-wrapper [messages]="messages()" 
      [isLoading]="isLoading()"
      [header]="header()"
      [noData]="noData()"
    >
      <common-basic-table [columns]="columns" [data]="data()"></common-basic-table>
    </common-common-wrapper>
  `,  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent extends AbstractEntitiesListComponent<ProductInterface> {  
  
  protected override getColumns(): Array<[keyof ProductInterface, string]> {
    // Adjusting the columns names and the sequence
    return [
      ['name', 'Name'],
      ['category', 'Category'],
      ['description', 'Description'],
      ['inventoryStatus', 'Status'],
      ['code', 'Code'],
      ['price', 'Price'],
      ['quantity', 'Quantity'],
      ['rating', 'Rating'],
    ];
  }
}
