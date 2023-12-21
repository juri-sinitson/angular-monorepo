import { Component, Input } from '@angular/core';
import { MessagesModule } from 'primeng/messages';
import { MessageInterface } from '../../interfaces/message.interface';

@Component({
  selector: 'common-messages',
  standalone: true,
  imports: [MessagesModule],
  template: `
    <p-messages [(value)]="messages" [enableService]="false"></p-messages>
  `,  
})
export class MessagesComponent {

  private messages_: MessageInterface[] = [];

  @Input() lastMessagesAmount = 5;
  @Input() set messages(messages: MessageInterface[]) {
    // Take only x last messages to avoid overflow
    this.messages_ = messages.slice(-this.lastMessagesAmount);
  }

  get messages(): MessageInterface[] {
    return this.messages_;
  }
}
