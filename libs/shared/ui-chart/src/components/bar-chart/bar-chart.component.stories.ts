import type { Meta, StoryObj } from '@storybook/angular';
import { BarChartComponent } from './bar-chart.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<BarChartComponent> = {
  component: BarChartComponent,
  title: 'shared/ui-chart/Bar Chart',
};
export default meta;
type Story = StoryObj<BarChartComponent>;

export const primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/bar-chart works!/gi)).toBeTruthy();
  },
};
