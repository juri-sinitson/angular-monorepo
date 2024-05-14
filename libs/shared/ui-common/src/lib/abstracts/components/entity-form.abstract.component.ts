import { Entity, MessageInterface } from '@angular-monorepo/shared/util-common';
import { Component, effect, input, output, signal } from '@angular/core';


@Component({template: ``})
export abstract class AbstractEntityFormComponent<T> {
  data = input<Entity | null>(null);

  messages = input<MessageInterface[]>([]);
  
  isLoading = input<boolean>(false);
  header = input<string | undefined>(undefined);   

  onSubmit = output<T>();
  onCancel = output<void>();

  formMessages = signal<MessageInterface[]>([]);  

  constructor() {
    // Show the modified error message
    effect(() => {

      // Not using computed here because the computed value is reflected to the 
      // parent for some reason.
      const messagesModif: MessageInterface[] = [...this.messages()].map((message) => {
          const result: MessageInterface = message;
          if(message.severity === 'error') {
            result.detail = 'Submitting failure!';
          }
          return result;
        });

      this.formMessages.set(messagesModif);
    }, {allowSignalWrites: true});        
  }

  isSubmitDisabled(): boolean {
    return !this.isEntityFormValid();
  }

  submitHandler() {
    this.onSubmit.emit(this.getFormValue());
  }

  cancelHandler() {
    this.onCancel.emit();
  }

  abstract isEntityFormValid(): boolean;
  protected abstract getFormValue(): T;  
}
