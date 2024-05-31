import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';

import { CardComponent } from './card.component';

import {
  expectNoText,
  expectText,
  getCanvas,
} from '@angular-monorepo/shared/util-common-non-prod';

// TODO: Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { rootComponentConfigBase as commonAppConfig } from '@angular-monorepo/shared/util-common-non-prod';

/**
 * Testing component.
 *
 * We create this component because of
 * the fictive content. So we demonstrate
 * how the content is put to a card.
 */
@Component({
  selector: 'common-card-tester',
  standalone: true,
  imports: [CardComponent],
  template: `
    <common-card [header]="header">
      <p>Main content</p>
    </common-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTestComponent {
  // TODO! Figure how to use signal
  // inputs here that the controls
  // of storybook stay usable.
  @Input() header: string | undefined;
}

const meta: Meta<CardTestComponent> = {
  component: CardTestComponent,
  title: 'shared/ui-common/Card',
  decorators: [applicationConfig({ ...commonAppConfig })],
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
