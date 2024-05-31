import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

const catalogueMessagePart = `in a catalogue of presentational components`;

const confirmationData = {
  message: `A CRUD-Operation is not supported ${catalogueMessagePart}.`,
  header: 'Information',
  icon: 'pi pi-info-circle',
  acceptLabel: 'OK',
  rejectVisible: false,
  dismissableMask: true,
};


@Component({
  template: ``,
  standalone: true,
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmNotImplementedWrapperComponent {
  
  constructor(private confirmationService: ConfirmationService) {}

  cancelHandler() {
    this.confirmationService.confirm({
      ...confirmationData, 
      message: `Cancelling is not available in this catalogue context.`
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  crudOperationHandler(operation: string) {    
    this.confirmationService.confirm(confirmationData);
  } 
}
