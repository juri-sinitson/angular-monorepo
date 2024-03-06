import { Component, input } from '@angular/core';

import { MessageInterface } from '../../interfaces/message.interface';
import { CardComponent } from '../card/card.component';
import { MessagesComponent } from '../messages/messages.component';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';

@Component({
  selector: 'common-common-wrapper',
  standalone: true,
  imports: [
    CardComponent,
    MessagesComponent,
    ProgressSpinnerComponent,
  ],
  template: `
    <common-card [header]="header()">
      @if(messages().length > 0) {
        <div data-testid="messages">
          <common-messages [messages]="messages()">
          </common-messages>
        </div>
      }
      @if(showContent() && !loading()) {
        <!-- THE CONTENT OF THE COMPONENT THAT IS WRAPPED -->
        <ng-content></ng-content>
      }
      @if(loading()) {
        <div class="flex justify-content-center" data-testid="loading">
          <common-progress-spinner [loadingMessage]="loadingMessage()">
          </common-progress-spinner>          
        </div>
      }
    </common-card>
  `,  
})
export class CommonWrapperComponent {
  messages = input<MessageInterface[]>([]);  
  showContent = input<boolean>(true);
  loading = input<boolean>(false);
  loadingMessage = input<string>('');
  lastMessagesAmount = input<number>(5);
  header = input<string | undefined>(undefined);
}
