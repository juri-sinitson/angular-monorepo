import type { Meta, StoryObj } from '@storybook/angular';
import { ProgressSpinnerComponent } from './progress-spinner.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<ProgressSpinnerComponent> = {
  component: ProgressSpinnerComponent,
  title: 'ProgressSpinnerComponent',
};
export default meta;
type Story = StoryObj<ProgressSpinnerComponent>;

export const Primary: Story = {
  args: {
    loadingMessage: '',
  },
};

export const Heading: Story = {
  args: {
    loadingMessage: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/progress-spinner works!/gi)).toBeTruthy();
  },
};
