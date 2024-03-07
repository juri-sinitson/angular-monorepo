import { commonAppConfig } from '@angular-monorepo/shared/util-common';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';

import { MessageInterface } from '@angular-monorepo/shared/util-common';

import { MessagesComponent } from './messages.component';
import { expectNoText, expectText, getCanvas } from '@angular-monorepo/shared/util-common-non-prod';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'common-messages-test-wrapper',
  standalone: true,
  imports: [MessagesComponent],
  template: `
    <common-messages [messages]="messages"></common-messages>
  `,  
})
export class MessagesTestWrapperComponent {
  // TODO! Figure how to use signal 
  // inputs here that the controls 
  // of storybook stay usable.
  @Input() messages: MessageInterface[] = [];
}

const meta: Meta<MessagesTestWrapperComponent> = {
  component: MessagesTestWrapperComponent,
  title: 'shared/ui-common/Messages',
  decorators: [
    applicationConfig({...commonAppConfig})
  ],
};
export default meta;
type Story = StoryObj<MessagesTestWrapperComponent>;

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
