import type { Meta, StoryObj } from '@storybook/angular';
import { BasicTableComponent } from './basic-table.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<BasicTableComponent> = {
  component: BasicTableComponent,
  title: 'shared/ui-common/Basic Table',
};
export default meta;
type Story = StoryObj<BasicTableComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/basic-table works!/gi)).toBeTruthy();
  },
};
