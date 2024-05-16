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
import {
  MessageInterface,
  commonAppConfig,
} from '@angular-monorepo/shared/util-common';

// -- STEP 1: Import the entity interface
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PersonInterface as EntityInterface } from '@angular-monorepo/shared-business/examples';
// -- STEP 2: Import the entity form component
import { PersonFormComponent as EntityFormComponent } from './person-form.component';

const header = 'Person';

@Component({
  selector: 'angular-monorepo-person-form-wrapper',
  standalone: true,
  imports: [
    // PrimeNG
    ConfirmDialogModule,

    // Own
    EntityFormComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <angular-monorepo-person-form
      [data]="data"
      [messages]="messages"
      [isLoading]="isLoading"
      [header]="header"
      (onSubmit)="crudOperationHandler('Data submitting')"
      (onCancel)="cancelHandler()"
    ></angular-monorepo-person-form>
    <p-confirmDialog [style]="{ maxWidth: '450px' }"></p-confirmDialog>
  `,
})
class EntityFormWrapperComponent extends ConfirmNotImplementedWrapperComponent {
  @Input() data: EntityInterface | null = null;
  @Input() messages: MessageInterface[] = [];
  @Input() isLoading = false;
  @Input() header: string | undefined = undefined;
}

const meta: Meta<EntityFormWrapperComponent> = {
  component: EntityFormWrapperComponent,
  decorators: [applicationConfig({ ...commonAppConfig })],
  // -- STEP 3: adjust the title
  title: 'shared-business/feature-examples/Person Form',
};
export default meta;
type Story = StoryObj<EntityFormWrapperComponent>;

// -- STEP 4: create an example entity
const data: EntityInterface = {
  id: '1006',
  code: 'xyz789',
  name: 'Example Person',
  description: 'This is an example person.',
  price: 10,
  category: 'Example Category',
  quantity: 10,
  inventoryStatus: 'OUTOFSTOCK',
  rating: 3,
};

export const primary: Story = {
  args: {
    header,
    data,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    // -- STEP 5: adjust the form fields and the data
    await expectTextInputValue('id-input', '1006', canvas);
    await expectTextInputValue('code-input', 'xyz789', canvas);
    await expectTextInputValue('name-input', 'Example Person', canvas);
    await expectTextInputValue(
      'description-input',
      'This is an example person.',
      canvas
    );
    await expectNumberInputValue('price-input', '€10.00', canvas);
    await expectTextInputValue('category-input', 'Example Category', canvas);
    await expectNumberInputValue('quantity-input', '10', canvas);
    await expectDropdownValue('inventory-status-input', 'Out of Stock', canvas);
    await expectNumberInputValue('rating-input', '3', canvas);
    await expectFormValid(canvas);

    // -- STEP 6: adjust the form fields
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
    header,
    data: null,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    // -- STEP 7: adjust the form fields
    await expectTextInputValue('id-input', '0', canvas);
    await expectTextInputValue('code-input', '-', canvas);
    await expectTextInputValue('name-input', '', canvas);
    await expectTextInputValue('description-input', '', canvas);
    await expectNumberInputValue('price-input', '', canvas);
    await expectTextInputValue('category-input', '', canvas);
    await expectNumberInputValue('quantity-input', '', canvas);
    await expectDropdownValue(
      'inventory-status-input',
      'Select Inventory Status',
      canvas
    );
    await expectNumberInputValue('rating-input', '', canvas);
    await expectFormInvalid(canvas);
  },
};

export const Loading: Story = {
  args: {
    ...loadingStory.args,
    data,
    header,
  },
  play: loadingStory.play,
};

export const Error: Story = {
  args: { ...errorStory.args, data, header },
  play: errorStory.play,
};
