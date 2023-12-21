import type { Meta, StoryObj } from '@storybook/angular';
import { CommonWrapperComponent } from './common-wrapper.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<CommonWrapperComponent> = {
  component: CommonWrapperComponent,
  title: 'CommonWrapperComponent',
};
export default meta;
type Story = StoryObj<CommonWrapperComponent>;

export const Primary: Story = {
  args: {
    messages: [],
    showContent: true,
    loading: false,
    loadingMessage: '',
    lastMessagesAmount: 5,
    header: undefined,
  },
};

export const Heading: Story = {
  args: {
    messages: [],
    showContent: true,
    loading: false,
    loadingMessage: '',
    lastMessagesAmount: 5,
    header: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/common-wrapper works!/gi)).toBeTruthy();
  },
};
