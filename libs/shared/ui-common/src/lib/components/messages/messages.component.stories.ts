import { commonAppConfig } from '@angular-monorepo/shared/util-common';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';

import { MessageInterface } from '@angular-monorepo/shared/util-common';

import { MessagesComponent } from './messages.component';
import { expectNoText, expectText, getCanvas } from '../../lib-intern-util/component-test.po';

const meta: Meta<MessagesComponent> = {
  component: MessagesComponent,
  title: 'shared/ui-common/Messages',
  decorators: [
    applicationConfig({...commonAppConfig})
  ],
};
export default meta;
type Story = StoryObj<MessagesComponent>;

const messages: MessageInterface[] = [
  {
    severity: 'info',
    summary: 'Info',
    detail: 'Not there',
  },
  {
    severity: 'info',
    summary: 'Info',
    detail: 'Not there',
  },
  {
    severity: 'success',
    summary: 'Success',
    detail: 'Success message 1',
  },
  {
    severity: 'error',
    summary: 'Error',
    detail: 'Error message',
  },
  {
    severity: 'warn',
    summary: 'Warning',
    detail: 'Warning message',
  },
  {
    severity: 'info',
    summary: 'Info',
    detail: 'Info message',
  },
  {
    severity: 'success',
    summary: 'Success',
    detail: 'Success message 2',
  },
];

export const Primary: Story = {
  args: {
    lastMessagesAmount: 5,
    messages,
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectNoText('Not there', canvas);
    await expectText('Success message 1', canvas);
    await expectText('Error message', canvas);
    await expectText('Warning message', canvas);
    await expectText('Info message', canvas);
    await expectText('Success message 2', canvas);
  }
};
