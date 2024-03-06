import type { Meta, StoryObj } from '@storybook/angular';
import { ProgressSpinnerComponent } from './progress-spinner.component';
import { expectElem, expectNoElem, expectText, getCanvas } from '../../lib-intern-util/component-test.po';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'common-messages-test-wrapper',
  standalone: true,
  imports: [ProgressSpinnerComponent],
  template: `
    <common-progress-spinner [loadingMessage]="loadingMessage"></common-progress-spinner>
  `,  
})
export class ProgressSpinnerTestWrapperComponent {
  // TODO! Figure how to use signal 
  // inputs here that the controls 
  // of storybook stay usable.
  @Input() loadingMessage = '';
}

const meta: Meta<ProgressSpinnerTestWrapperComponent> = {
  component: ProgressSpinnerTestWrapperComponent,
  title: 'shared/ui-common/Progress Spinner',
};
export default meta;
type Story = StoryObj<ProgressSpinnerTestWrapperComponent>;

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
