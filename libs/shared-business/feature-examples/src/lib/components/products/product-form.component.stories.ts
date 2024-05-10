import { Component, Input } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { Meta, StoryObj, applicationConfig } from '@storybook/angular';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getCanvas,
  ConfirmNotImplementedWrapperComponent,  
  expectTextInputValue,
  expectNumberInputValue,
  expectDropdownValue,
  expectFormInvalidByTextInput,
  expectFormValid,
  expectFormInvalid,
  loadingStory,
  errorStory,
} from '@angular-monorepo/shared/util-common-non-prod';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface, commonAppConfig } from '@angular-monorepo/shared/util-common';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface } from '@angular-monorepo/shared-business/examples';

import { ProductFormComponent } from './product-form.component';


@Component({
  selector: 'angular-monorepo-product-form-wrapper',
  standalone: true,
  imports: [
    // PrimeNG
    ConfirmDialogModule,
    
    // Own
    ProductFormComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <angular-monorepo-product-form 
      [data]="data"
      [messages]="messages"
      [isLoading]="isLoading"
      [header]="header"  
      (onSubmit)="crudOperationHandler('Data submitting')"
      (onCancel)="cancelHandler()"
    ></angular-monorepo-product-form>
    <p-confirmDialog [style]="{ maxWidth: '450px' }"></p-confirmDialog>
  `,
})
class ProductFormWrapperComponent extends ConfirmNotImplementedWrapperComponent {
  @Input() data: ProductInterface | null = null;
  @Input() messages: MessageInterface[] = [];
  @Input() isLoading = false;  
  @Input() header: string | undefined = undefined;
}

const meta: Meta<ProductFormWrapperComponent> = {
  component: ProductFormWrapperComponent,  
  decorators: [
    applicationConfig({ ...commonAppConfig }),    
  ],
  title: 'shared-business/feature-examples/Product Form',
};
export default meta;
type Story = StoryObj<ProductFormWrapperComponent>;

const data: ProductInterface = {
  id: '1006',
  code: 'xyz789',
  name: 'Example Product',
  description: 'This is an example product.',
  price: 10,
  category: 'Example Category',
  quantity: 10,
  inventoryStatus: 'OUTOFSTOCK',
  rating: 3,
};

export const primary: Story = {
  args: {
    header: 'Product',
    data,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    await expectTextInputValue('id-input', '1006', canvas);
    await expectTextInputValue('code-input', 'xyz789', canvas);
    await expectTextInputValue('name-input', 'Example Product', canvas);
    await expectTextInputValue('description-input', 'This is an example product.', canvas);
    await expectNumberInputValue('price-input', '€10.00', canvas);
    await expectTextInputValue('category-input', 'Example Category', canvas);
    await expectNumberInputValue('quantity-input', '10', canvas);
    await expectDropdownValue('inventoryStatus-input', 'Out of Stock', canvas);
    await expectNumberInputValue('rating-input', '3', canvas);
    await expectFormValid(canvas);

    // testing the invalidity of the form
    await expectFormInvalidByTextInput('name-input', canvas);
    await expectFormInvalidByTextInput('description-input', canvas);
    await expectFormInvalidByTextInput('price-input', canvas);
    await expectFormInvalidByTextInput('category-input', canvas);
    await expectFormInvalidByTextInput('quantity-input', canvas);
    await expectFormInvalidByTextInput('rating-input', canvas);
  },
};

export const newEntry: Story = {
  args: {
    header: 'Product',
    data: null,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    await expectTextInputValue('id-input', '0', canvas);
    await expectTextInputValue('code-input', '-', canvas);
    await expectTextInputValue('name-input', '', canvas);
    await expectTextInputValue('description-input', '', canvas);
    await expectNumberInputValue('price-input', '', canvas);
    await expectTextInputValue('category-input', '', canvas);
    await expectNumberInputValue('quantity-input', '', canvas);
    await expectDropdownValue('inventoryStatus-input', 'Select Inventory Status', canvas);
    await expectNumberInputValue('rating-input', '', canvas);
    await expectFormInvalid(canvas);
  },
};

export const Loading: Story = {
  args: {
    ...loadingStory.args,
    data,
    header: 'Product',
  },
  play: loadingStory.play,
};

export const Error: Story = {
  args: { ...errorStory.args, data, header: 'Product' },
  play: errorStory.play,
};