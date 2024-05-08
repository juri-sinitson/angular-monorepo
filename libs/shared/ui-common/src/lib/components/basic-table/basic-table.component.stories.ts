import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';

// TODO: Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { commonAppConfig } from '@angular-monorepo/shared/util-common';

import { BasicTableComponent } from './basic-table.component';

import {
  expectElemOfMultiple,
  expectNoElem,
  expectTableColElemText,
  expectTableValueElemText,
  getCanvas,
  ConfirmNotImplementedWrapperComponent,
} from '@angular-monorepo/shared/util-common-non-prod';

import { TableColumn } from '../../types/table';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

export interface ProductInterface {
  code: string;
  name: string;
  category: string;
  quantity: number;
}

const productsList: ProductInterface[] = [
  {
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    category: 'Accessories',
    quantity: 24,
  },
  {
    code: 'nvklal433',
    name: 'Black Watch',
    category: 'Accessories',
    quantity: 61,
  },
  {
    code: 'zz21cz3c1',
    name: 'Blue Band',
    category: 'Fitness',
    quantity: 2,
  },
  {
    code: '244wgerg2',
    name: 'Blue T-Shirt',
    category: 'Clothing',
    quantity: 25,
  },
  {
    code: 'h456wer53',
    name: 'Bracelet',
    category: 'Accessories',
    quantity: 73,
  },
];

@Component({
  selector: 'common-basic-table-test-wrapper',
  standalone: true,
  imports: [
    // PrimeNG
    ConfirmDialogModule,
    
    // Own
    BasicTableComponent
  ],
  providers: [
    // PrimeNg
    ConfirmationService,
  ],
  template: `
    <common-basic-table
      [data]="products"
      [columns]="columns"
      [crud]="crud"
      (onEdit)="onCrudOperation('Editing')"
      (onDelete)="onCrudOperation('Deletion')"
    ></common-basic-table>
    <!-- TODO! unify the dialog max width with a utility class -->
    <p-confirmDialog [style]="{ maxWidth: '450px' }"></p-confirmDialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicTableTestWrapperComponent extends ConfirmNotImplementedWrapperComponent {
  // TODO! Figure how to use signal
  // inputs here that the controls
  // of storybook stay usable.
  // If you figure out, you can remove this wrapper.
  @Input() products: ProductInterface[] = [];
  @Input() columns: TableColumn | undefined = undefined;
  @Input() crud = false;
}

const meta: Meta<BasicTableTestWrapperComponent> = {
  component: BasicTableTestWrapperComponent,
  decorators: [applicationConfig({ ...commonAppConfig })],
  title: 'shared/ui-common/Basic Table',
};
export default meta;
type Story = StoryObj<BasicTableTestWrapperComponent>;

const providedColumns: TableColumn = [
  ['name', 'Name'],
  ['category', 'Kategorie'],
  ['quantity', 'Anzahl'],
  ['code', 'Code'],
];

const expectProvidedColumns = async (canvas: HTMLCanvasElement) => {
  await expectTableColElemText('col-code', 'Code', canvas);
  await expectTableColElemText('col-name', 'Name', canvas);
  await expectTableColElemText('col-category', 'Kategorie', canvas);
  await expectTableColElemText('col-quantity', 'Anzahl', canvas);
};

export const colNamesDerived: Story = {
  args: {
    products: productsList,
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectTableColElemText('col-code', 'Code', canvas);
    await expectTableColElemText('col-name', 'Name', canvas);
    await expectTableColElemText('col-category', 'Category', canvas);
    await expectTableColElemText('col-quantity', 'Quantity', canvas);

    // Checking the first row only, that should be enough.
    await expectTableValueElemText('val-code', 'f230fh0g3', canvas);
    await expectTableValueElemText('val-name', 'Bamboo Watch', canvas);
    await expectTableValueElemText('val-category', 'Accessories', canvas);
    await expectTableValueElemText('val-quantity', '24', canvas);
  },
};

export const colNamesProvided: Story = {
  args: {
    products: productsList,
    columns: providedColumns,
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);

    await expectProvidedColumns(canvas);

    // Checking the first row only, that should be enough.
    await expectTableValueElemText('val-code', 'f230fh0g3', canvas);
    await expectTableValueElemText('val-name', 'Bamboo Watch', canvas);
    await expectTableValueElemText('val-category', 'Accessories', canvas);
    await expectTableValueElemText('val-quantity', '24', canvas);
  },
};

export const crud: Story = {
  args: {
    products: productsList,
    crud: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);

    // Checking the first row only, that should be enough.
    await expectElemOfMultiple('edit', canvas);
    await expectElemOfMultiple('delete', canvas);
  },
};

export const noData: Story = {
  args: {
    products: [],
    columns: providedColumns,
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);

    await expectProvidedColumns(canvas);

    await expectNoElem('val-code', canvas);
    await expectNoElem('val-name', canvas);
    await expectNoElem('val-category', canvas);
    await expectNoElem('val-quantity', canvas);
  },
};
