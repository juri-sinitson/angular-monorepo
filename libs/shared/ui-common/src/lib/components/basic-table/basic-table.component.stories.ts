import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import type { Meta, StoryObj } from '@storybook/angular';
import { BasicTableComponent } from './basic-table.component';

import { 
  expectNoElem,
  expectTableColElemText, 
  expectTableValueElemText, 
  getCanvas 
} 
from '@angular-monorepo/shared/util-common-non-prod';

import { TableColumn } from '../../types/table';


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
  imports: [BasicTableComponent],
  template: `
    <common-basic-table [data]="products" [columns]="columns"></common-basic-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicTableTestWrapperComponent {
  // TODO! Figure how to use signal 
  // inputs here that the controls 
  // of storybook stay usable.
  // If you figure out, you can remove this wrapper.
  @Input() products: ProductInterface[] = [];
  @Input() columns: TableColumn | undefined = undefined;
}

const meta: Meta<BasicTableTestWrapperComponent> = {
  component: BasicTableTestWrapperComponent,
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
}

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
