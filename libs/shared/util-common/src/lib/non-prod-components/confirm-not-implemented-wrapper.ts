import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  template: ``,
  standalone: true,
  providers: [ConfirmationService],
})
export class ConfirmNotImplementedWrapperComponent {
  
  constructor(private confirmationService: ConfirmationService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCrudOperation(operation: string) {
    
    this.confirmationService.confirm({
      message: `A CRUD-Operation is not supported in a catalogue of presentational components.`,
      header: 'Information',
      icon: 'pi pi-info-circle',
      acceptLabel: 'OK',
      rejectVisible: false,
      dismissableMask: true,
    });
  } 
}
