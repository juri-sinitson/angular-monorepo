import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ProductsComponent } from './products.component';
// TODO: Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface } from '@angular-monorepo/shared-business/examples';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface, commonAppConfig } from '@angular-monorepo/shared/util-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  errorStory,
  getFirstElemByText,
  expectNoElem,
  expectText,
  getCanvas,
  loadingStory,
  noDataStory,
  ConfirmNotImplementedWrapperComponent,
} from '@angular-monorepo/shared/util-common-non-prod';

const productsList: ProductInterface[] = [
  {
    id: '1001',
    code: 'abc123',
    name: 'T-Shirt',
    description: 'Product Description',
    price: 20,
    category: 'Clothing',
    quantity: 50,
    inventoryStatus: 'INSTOCK',
    rating: 4,
  },
  {
    id: '1002',
    code: 'def456',
    name: 'Jeans',
    description: 'Product Description',
    price: 50,
    category: 'Clothing',
    quantity: 30,
    inventoryStatus: 'INSTOCK',
    rating: 5,
  },
  {
    id: '1003',
    code: 'ghi789',
    name: 'Shoes',
    description: 'Product Description',
    price: 80,
    category: 'Footwear',
    quantity: 20,
    inventoryStatus: 'INSTOCK',
    rating: 4.5,
  },
  {
    id: '1004',
    code: 'h456wer53',
    name: 'Bracelet',
    description: 'Product Description',
    price: 15,
    category: 'Accessories',
    quantity: 73,
    inventoryStatus: 'INSTOCK',
    rating: 4,
  },
  {
    id: '1005',
    code: 'jkl012',
    name: 'Hat',
    description: 'Product Description',
    price: 10,
    category: 'Clothing',
    quantity: 100,
    inventoryStatus: 'INSTOCK',
    rating: 3.5,
  },
];

@Component({
  selector: 'angular-monorepo-products-test-wrapper',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    // PrimeNG
    ConfirmDialogModule,

    // Own
    ProductsComponent,
  ],
  template: `
    <angular-monorepo-products
      [data]="data"
      [messages]="messages"
      [isLoading]="isLoading"
      [header]="header"
      [noData]="noData"
      (onEdit)="onCrudOperation('Data editing')"
      (onDelete)="onCrudOperation('Data deletion')"
    >
    </angular-monorepo-products>
    <p-confirmDialog [style]="{ maxWidth: '450px' }"></p-confirmDialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductWrapperComponent extends ConfirmNotImplementedWrapperComponent {
  @Input() data: ProductInterface[] = [];
  @Input() messages: MessageInterface[] = [];
  @Input() isLoading = false;
  @Input() noData = false;
  @Input() header: string | undefined = undefined;
}

const meta: Meta<ProductWrapperComponent> = {
  component: ProductWrapperComponent,
  decorators: [applicationConfig({ ...commonAppConfig })],
  title: 'shared-business/feature-examples/Products',
};
export default meta;
type Story = StoryObj<ProductWrapperComponent>;

const expectCols = async (canvas: HTMLElement) => {
  await expectText('Name', canvas);
  await expectText('Category', canvas);
  await expectText('Description', canvas);
  await expectText('Status', canvas);
  await expectText('Code', canvas);
  await expectText('Price', canvas);
  await expectText('Quantity', canvas);
  await expectText('Rating', canvas);
};

const expectValues = async (canvas: HTMLElement) => {
  await expectText('T-Shirt', canvas);
  await getFirstElemByText('Clothing', canvas);
  await getFirstElemByText('Product Description', canvas);
  await getFirstElemByText('INSTOCK', canvas);
  await expectText('abc123', canvas);
  await getFirstElemByText('20', canvas);
  await getFirstElemByText('50', canvas);
  await getFirstElemByText('4', canvas);

  await expectText('Jeans', canvas);
  await getFirstElemByText('Clothing', canvas);
  await getFirstElemByText('Product Description', canvas);
  await getFirstElemByText('INSTOCK', canvas);
  await expectText('def456', canvas);
  await getFirstElemByText('50', canvas);
  await getFirstElemByText('30', canvas);
  await getFirstElemByText('5', canvas);
};

export const Primary: Story = {
  args: {
    data: productsList,
    messages: [],
    isLoading: false,
    noData: false,
    header: 'Products',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    await expectCols(canvas);
    await expectValues(canvas);

    await expectNoElem('loading', canvas);
    await expectNoElem('messages', canvas);
    await expectNoElem('no-data', canvas);
  },
};

export const Loading: Story = {
  args: {
    ...loadingStory.args,
    data: productsList,
    header: 'Products',
  },
  play: loadingStory.play,
};

export const Error: Story = {
  args: { ...errorStory.args, header: 'Products' },
  play: errorStory.play,
};

export const noData: Story = {
  args: { ...noDataStory.args, header: 'Products' },
  play: noDataStory.play,
};
