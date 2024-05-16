import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { PersonsComponent as EntitiesComponent } from './persons.component';
// TODO: Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PersonInterface as EntityInterface } from '@angular-monorepo/shared-business/examples';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  MessageInterface,
  commonAppConfig,
} from '@angular-monorepo/shared/util-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  errorStory,
  getFirstElemByText,
  expectText,
  loadingStory,
  noDataStory,
  ConfirmNotImplementedWrapperComponent,
  primaryTableStory,
  getCanvas,
  expectNoElem,
} from '@angular-monorepo/shared/util-common-non-prod';

const entitiesList: EntityInterface[] =
  // -- STEP 1: Adjust the example data
  // TIP: you can use copilot or similar AI-solution for this
  // by providing the entity interface to the AI and telling
  // to adjust this file to that entity interface for you.
  [
    {
      id: '1001',
      code: 'abc123',
      name: 'T-Shirt',
      description: 'Person Description',
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
      description: 'Person Description',
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
      description: 'Person Description',
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
      description: 'Person Description',
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
      description: 'Person Description',
      price: 10,
      category: 'Clothing',
      quantity: 100,
      inventoryStatus: 'INSTOCK',
      rating: 3.5,
    },
  ];

const header = 'Person';

@Component({
  selector: 'angular-monorepo-persons-test-wrapper',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    // PrimeNG
    ConfirmDialogModule,

    // Own
    EntitiesComponent,
  ],
  template: `
    <angular-monorepo-persons
      [data]="data"
      [messages]="messages"
      [isLoading]="isLoading"
      [header]="header"
      [noData]="noData"
      [crud]="true"
      (onDelete)="crudOperationHandler('Data deletion')"
      (onEdit)="crudOperationHandler('Data editing')"
      (onNewBeforeSubmit)="crudOperationHandler('Data submitting')"
      (onNew)="crudOperationHandler('Data submitting')"
      (onUpdate)="crudOperationHandler('Data submission')"
    >
    </angular-monorepo-persons>
    <p-confirmDialog [style]="{ maxWidth: '450px' }"></p-confirmDialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityWrapperComponent extends ConfirmNotImplementedWrapperComponent {
  @Input() data: EntityInterface[] = [];
  @Input() messages: MessageInterface[] = [];
  @Input() isLoading = false;
  @Input() noData = false;
  @Input() header: string | undefined = undefined;
}

const meta: Meta<EntityWrapperComponent> = {
  component: EntityWrapperComponent,
  decorators: [applicationConfig({ ...commonAppConfig })],
  // -- STEP 2: Adjust the title for the storybook to place in the
  // correct place of the components tree
  title: 'shared-business/feature-examples/Person',
};
export default meta;
type Story = StoryObj<EntityWrapperComponent>;

const expectCols = async (canvas: HTMLElement) => {
  // -- STEP 3: Adjust the columns --
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
  // -- STEP 4: Adjust the values for the first row --
  await expectText('T-Shirt', canvas);
  await getFirstElemByText('Clothing', canvas);
  await getFirstElemByText('Person Description', canvas);
  await getFirstElemByText('INSTOCK', canvas);
  await expectText('abc123', canvas);
  await getFirstElemByText('20', canvas);
  await getFirstElemByText('50', canvas);
  await getFirstElemByText('4', canvas);

  // -- STEP 5: Adjust the values for the second row --
  await expectText('Jeans', canvas);
  await getFirstElemByText('Clothing', canvas);
  await getFirstElemByText('Person Description', canvas);
  await getFirstElemByText('INSTOCK', canvas);
  await expectText('def456', canvas);
  await getFirstElemByText('50', canvas);
  await getFirstElemByText('30', canvas);
  await getFirstElemByText('5', canvas);
};

export const Primary: Story = {
  args: { ...primaryTableStory.args, data: entitiesList, header },
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
    data: entitiesList,
    header,
  },
  play: loadingStory.play,
};

export const Error: Story = {
  args: { ...errorStory.args, header },
  play: errorStory.play,
};

export const noData: Story = {
  args: { ...noDataStory.args, header },
  play: noDataStory.play,
};
