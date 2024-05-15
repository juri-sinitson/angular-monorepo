import { Entity, MessageInterface } from '@angular-monorepo/shared/util-common';
import { Component, OnInit, effect, input, output, signal } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({template: ``})
export abstract class AbstractEntityFormComponent<T extends Entity> implements OnInit {
  data = input<Entity | null>(null);

  messages = input<MessageInterface[]>([]);
  
  isLoading = input<boolean>(false);
  header = input<string | undefined>(undefined);   

  onSubmit = output<T>();
  onCancel = output<void>();

  formMessages = signal<MessageInterface[]>([]);  

  entityForm: FormGroup = new FormGroup({});
  
  ngOnInit(): void {        
    this.initForm(this.data());    
  }

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

  compareValuesWhichCanBeEmpty(value1: unknown, value2: unknown, empty1: unknown, empty2: unknown) : boolean {
    return value1 === value2 || (value1 === empty1 && value2 === empty2);
  }

  changesMade(): boolean {
    return this.entityForm.dirty;
  }

  protected getExistingEntity(): T | undefined {
    return {} as T;
  }

  isSubmitDisabled(): boolean {
    return (
      !this.isEntityFormValid() || 
      !this.changesMade()
    );
  }

  submitHandler() {
    this.onSubmit.emit(this.getFormValue());
  }

  cancelHandler() {
    this.onCancel.emit();
  }

  isExistingEntitySameAsEdited(): boolean {
    const existingEntity: T | undefined = this.getExistingEntity();
    const id = this.getControlValueByPath('id', this.entityForm);
    const sameAsEditedEntity = (id === existingEntity?.id);
    const result = (!existingEntity || sameAsEditedEntity)
    return result;
  }

  protected getControlValueByPath<T>(path: string, form: AbstractControl): T | null {
    return form.get(path)?.value ?? null;
  }

  protected getControlValue<T>(control: AbstractControl): T {
    return control.value ?? undefined;
  }

  protected existingEntityMultiFieldValidator(): ValidatorFn {    
    return (): ValidationErrors | null => {                  
      const validationFail = { entityAlreadyExists: true };
      return this.isExistingEntitySameAsEdited() ? null : validationFail;         
    };
  }


  abstract isEntityFormValid(): boolean;  
  protected abstract getFormValue(): T;
  protected abstract initForm(data: Entity | null): void;  
}
