import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';

import {
  expectElem,
  expectNoElem,
  expectText,
  getCanvas,
} from '@angular-monorepo/shared/util-common-non-prod';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { rootComponentConfigBase as commonAppConfig } 
  from '@angular-monorepo/shared/util-common-non-prod';
import { ProgressSpinnerComponent } from './progress-spinner.component';

@Component({
  selector: 'common-messages-test-wrapper',
  standalone: true,
  imports: [ProgressSpinnerComponent],
  template: `
    <common-progress-spinner
      [loadingMessage]="loadingMessage"
    ></common-progress-spinner>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinnerTestWrapperComponent {
  // TODO! Figure how to use signal
  // inputs here that the controls
  // of storybook stay usable.
  @Input() loadingMessage = '';
}

const meta: Meta<ProgressSpinnerTestWrapperComponent> = {
  component: ProgressSpinnerTestWrapperComponent,
  decorators: [applicationConfig({ ...commonAppConfig })],
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
  },
};

export const withMessage: Story = {
  args: {
    loadingMessage: 'Loading',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectElem('loadingMessage', canvas);
    await expectText('Loading...', canvas);
  },
};
