import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { 
  BasicTableComponent, 
  CommonWrapperComponent, 
} from '@angular-monorepo/shared/ui-common';
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface } from '@angular-monorepo/shared-business/examples';
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from '@angular-monorepo/shared/util-common';

// TODO! Add the wrapper and add the 
// appropriate entries to storybook.
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
export class ProductsComponent {
  data = input.required<ProductInterface[]>();
  messages = input<MessageInterface[]>([]);
  isLoading = input<boolean>(false);
  noData = input<boolean>(false);
  header = input<string | undefined>(undefined);
  // Adjusting the columns names and the sequence
  readonly columns: Array<[keyof ProductInterface, string]> = [
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
