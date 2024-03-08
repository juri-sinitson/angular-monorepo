import type { Meta, StoryObj } from '@storybook/angular';
import { ProductsComponent } from './products.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<ProductsComponent> = {
  component: ProductsComponent,
  title: 'ProductsComponent',
};
export default meta;
type Story = StoryObj<ProductsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/products works!/gi)).toBeTruthy();
  },
};
