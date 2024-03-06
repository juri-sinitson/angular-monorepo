import { Component, Input } from '@angular/core';

import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';

import { commonAppConfig } from '@angular-monorepo/shared/util-common';

import { CommonWrapperComponent } from './common-wrapper.component';
import { MessageInterface } from '../../interfaces/message.interface';
import { expectElem, expectNoElem, expectNoText, expectText, getCanvas } from '../../lib-intern-util/component-test.po';


const errorMessages: MessageInterface[] = [
  {
    severity: 'error',
    summary: 'Error',
    detail: 'Error message',
  },
];

const infoMessages: MessageInterface[] = [
  {
    severity: 'info',
    summary: 'Info',
    detail: 'Info message',
  },
];

/**
 * Testing component.
 * 
 * We create this component because of 
 * the wrapped content. So we demonstrate
 * how the content is wrapped.
 */
@Component({
  selector: 'common-wrapper-test',
  standalone: true,
  imports: [CommonWrapperComponent],
  template: `
    <common-common-wrapper [messages]="messages" [showContent]="showContent" 
    [loading]="loading" [loadingMessage]="loadingMessage" 
    [header]="header">
      <p>Wrapped content</p>
    </common-common-wrapper>
  `,
})
export class WrapperTestComponent {
  // TODO! Figure how to use signal 
  // inputs here that the controls 
  // of storybook stay usable.
  @Input() messages: MessageInterface[] = [];
  @Input() showContent = true;
  @Input() loading = false;
  @Input() loadingMessage = '';
  @Input() header: string | undefined = undefined;
}

const meta: Meta<WrapperTestComponent> = {
  component: WrapperTestComponent,
  title: 'shared/ui-common/Common Wrapper',
  decorators: [
    applicationConfig({...commonAppConfig})
  ],
};
export default meta;
type Story = StoryObj<WrapperTestComponent>;

export const showContent: Story = {
  args: {
    messages: [],
    showContent: true,
    loading: false,
    header: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectText('Wrapped content', canvas);
    await expectNoElem('loading', canvas);
    await expectNoElem('messages', canvas);
  },
};

export const contentWithHeader: Story = {
  args: {
    messages: [],
    showContent: true,
    loading: false,
    header: 'My Header',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectText('Wrapped content', canvas);
    await expectText('My Header', canvas);
    await expectNoElem('loading', canvas);
    await expectNoElem('messages', canvas);
  },  
};

export const loading: Story = {
  args: {
    messages: [],
    showContent: true,
    loading: true,
    loadingMessage: 'Loading',
    header: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectNoText('Wrapped content', canvas);
    await expectElem('loading', canvas);
    await expectText('Loading...', canvas);
    await expectNoElem('messages', canvas);
  },
};

export const messageWithContent: Story = {
  args: {
    messages: infoMessages,
    showContent: true,
    loading: false,
    header: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectText('Wrapped content', canvas);
    await expectNoElem('loading', canvas);
    await expectElem('messages', canvas);
    await expectText('Info message', canvas);
  },  
};

export const messageWithoutContent: Story = {
  args: {
    messages: errorMessages,
    showContent: false,
    loading: false,
    header: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectNoText('Wrapped content', canvas);
    await expectNoElem('loading', canvas);
    await expectElem('messages', canvas);
    await expectText('Error message', canvas);
  },
};

