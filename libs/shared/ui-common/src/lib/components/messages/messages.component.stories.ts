import type { Meta, StoryObj } from '@storybook/angular';
import { MessagesComponent } from './messages.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<MessagesComponent> = {
  component: MessagesComponent,
  title: 'MessagesComponent',
};
export default meta;
type Story = StoryObj<MessagesComponent>;

export const Primary: Story = {
  args: {
    lastMessagesAmount: 5,
    messages: '',
  },
};

export const Heading: Story = {
  args: {
    lastMessagesAmount: 5,
    messages: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/messages works!/gi)).toBeTruthy();
  },
};
