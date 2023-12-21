import type { Meta, StoryObj } from '@storybook/angular';
import { MessagesComponent } from './messages.component';

/*import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';*/
import { MessageInterface } from '../../interfaces/message.interface';

const meta: Meta<MessagesComponent> = {
  component: MessagesComponent,
  title: 'shared/ui-common/Messages',
};
export default meta;
type Story = StoryObj<MessagesComponent>;

const messages: MessageInterface[] = [
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
    detail: 'Success message',
  },
];

export const Primary: Story = {
  args: {
    lastMessagesAmount: 5,
    messages,
  },
};

export const Heading: Story = {
  args: {
    lastMessagesAmount: 5,
    messages,
  },
  /*play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/messages works!/gi)).toBeTruthy();
  },*/
};
