import { Component, Input } from '@angular/core';

import type { Meta, StoryObj } from '@storybook/angular';

import { CardComponent } from './card.component';

import { expectNoText, expectText, getCanvas } from '../../lib-intern-util/component-test.po';

@Component({
  selector: 'common-card-tester',
  standalone: true,
  imports: [CardComponent],
  template: `
    <common-card [header]="header">
      <p>Main content</p>
    </common-card>
  `,  
})
export class CardTestComponent {
  @Input() header: string | undefined;
}


const meta: Meta<CardTestComponent> = {
  component: CardTestComponent,
  title: 'shared/ui-common/Card',
};
export default meta;
type Story = StoryObj<CardTestComponent>;

export const withHeader: Story = {
  args: {
    header: 'My Header',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectText('My Header', canvas);
    await expectText('Main content', canvas);
  },
};

export const withoutHeader: Story = {
  args: {
    header: undefined,
  },
  play: async ({ canvasElement }) => {    
    const canvas = getCanvas(canvasElement);
    await expectNoText('My Header', canvas);
    await expectText('Main content', canvas);
  },
};
