import type { Meta, StoryObj } from '@storybook/angular';
import { ProgressSpinnerComponent } from './progress-spinner.component';
import { expectElem, expectNoElem, expectText, getCanvas } from '../../lib-intern-util/component-test.po';

const meta: Meta<ProgressSpinnerComponent> = {
  component: ProgressSpinnerComponent,
  title: 'shared/ui-common/Progress Spinner',
};
export default meta;
type Story = StoryObj<ProgressSpinnerComponent>;

export const withoutMessage: Story = {
  args: {
    loadingMessage: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectNoElem('loadingMessage', canvas);
  }
};

export const withMessage: Story = {
  args: {
    loadingMessage: 'Loading',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectElem('loadingMessage', canvas);
    await expectText('Loading...', canvas);
  }
};
