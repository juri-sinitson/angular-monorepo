import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LineChartComponent } from './line-chart.component';

// TODO: Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { commonAppConfig } from '@angular-monorepo/shared/util-common';

const documentStyle = getComputedStyle(document.documentElement);

const data = {
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
};

@Component({
  selector: 'chart-line-chart-test-wrapper',
  standalone: true,
  imports: [LineChartComponent],
  template: `
    <chart-line-chart [data]="data"></chart-line-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartTestWrapperComponent {
  // TODO! Figure how to use signal
  // inputs here that the controls
  // of storybook stay usable.
  // If you figure out, you can remove this wrapper.
  @Input() data: unknown = null;  
}

const meta: Meta<LineChartTestWrapperComponent> = {
  component: LineChartTestWrapperComponent,
  decorators: [applicationConfig({ ...commonAppConfig })],
  title: 'shared/ui-chart/Line Chart',
};
export default meta;
type Story = StoryObj<LineChartTestWrapperComponent>;


// TODO: Make visual regression tests for this component
// See https://storybook.js.org/docs/writing-tests/visual-testing
export const primary: Story = {
  args: {
    data,
  },
};
