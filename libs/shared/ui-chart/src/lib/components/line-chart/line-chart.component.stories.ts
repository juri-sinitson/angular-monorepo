import type { Meta, StoryObj } from '@storybook/angular';
import { LineChartComponent } from './line-chart.component';

const meta: Meta<LineChartComponent> = {
  component: LineChartComponent,
  title: 'shared/ui-chart/Line Chart',
};
export default meta;
type Story = StoryObj<LineChartComponent>;

const documentStyle = getComputedStyle(document.documentElement);

// TODO: Make visual regression tests for this component
// See https://storybook.js.org/docs/writing-tests/visual-testing
export const primary: Story = {
  args: {
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4,
        },
      ],
    },
  },
};
