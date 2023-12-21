import { provideAnimations } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';

import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';

import { CommonWrapperComponent } from './common-wrapper.component';
import { MessageInterface } from '../../interfaces/message.interface';



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
  @Input() messages: MessageInterface[] = [];
  @Input() showContent: boolean = true;
  @Input() loading: boolean = false;
  @Input() loadingMessage: string = '';
  @Input() header: string | undefined = undefined;
}


const meta: Meta<WrapperTestComponent> = {
  component: WrapperTestComponent,
  title: 'shared/ui-common/Common Wrapper',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
      ],
    })
  ],
};
export default meta;
type Story = StoryObj<WrapperTestComponent>;

export const showContent: Story = {
  args: {
    messages: [],
    showContent: true,
    loading: false,
  },
};

export const contentWithHeader: Story = {
  args: {
    messages: [],
    showContent: true,
    loading: false,
    header: 'My Header',
  },
};

export const loading: Story = {
  args: {
    messages: [],
    showContent: true,
    loading: true,
    loadingMessage: 'Loading...',
    header: undefined,
  },
};

export const messageWithContent: Story = {
  args: {
    messages: infoMessages,
    showContent: true,
    loading: false,
  },
};

export const messageWithoutContent: Story = {
  args: {
    messages: errorMessages,
    showContent: false,
    loading: false,
  },
};

/*export const Heading: Story = {
  args: {
    messages: [],
    showContent: true,
    loading: false,
    loadingMessage: '',
    header: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/common-wrapper works!/gi)).toBeTruthy();
  },
};*/
