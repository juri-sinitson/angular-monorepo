import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MessagesModule } from 'primeng/messages';

import { MessageInterface } from '@angular-monorepo/shared/util-common';

@Component({
  selector: 'common-messages',
  standalone: true,
  imports: [MessagesModule],
  template: `
    <p-messages [value]="messagesSliced()" [enableService]="false" [closable]="false"></p-messages>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent {
  lastMessagesAmount = input<number>(5);
  messages = input.required<MessageInterface[]>();
  messagesSliced = computed(() => {
    const amount: number = this.lastMessagesAmount();
    return this.messages().slice(-amount);
  });
}
