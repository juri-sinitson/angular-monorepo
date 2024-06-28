import { Component, computed, input, output } from "@angular/core";

import { MessageInterface, Entity, EntityId } from "@angular-monorepo/shared/util-common";

@Component({template: ``,})
export abstract class AbstractEntitiesListComponent<T extends Entity, TOriginal = T> {
  data = input.required<TOriginal[]>();
  messages = input<MessageInterface[]>([]);
  isLoading = input<boolean>(false);
  noData = input<boolean>(false);
  header = input<string | undefined>(undefined);  
  crud = input<boolean>(false);
  isError = input<boolean>(false);
  readonly columns!: Array<[keyof T, string]>;

  isFormLoading = computed<boolean>(() => this.isLoading() && this.showEntityDialog());
  isListLoading = computed<boolean>(() => this.isLoading() && !this.showEntityDialog());

  // -- CRUD  
  selectedEntity = input<Entity | null>(null);
  isNewBeforeSubmitBeingEdited = input<boolean>(false);
  onNewBeforeSubmit = output<void>();
  onEdit = output<EntityId>();
  onDelete = output<EntityId>();
  onUpdate = output<Entity>();
  onNew = output<Entity>();
  onCancel = output<void>();

  showEntityDialog = computed<boolean>(() => 
    !!this.selectedEntity() || this.isNewBeforeSubmitBeingEdited()
  );

  protected isNewEntity = computed<boolean>(() => this.isNewBeforeSubmitBeingEdited());
  // --

  protected abstract getColumns(): Array<[keyof T, string]>;

  constructor() {     
    this.columns = this.getColumns();
  }

  // -- CRUD
  cancelHandler() {
    this.onCancel.emit();
  }
  
  submitHandler($event: Entity) {
    if (this.isNewEntity()) {
      // We assume the item of correct type is coming here.
      // If not the probability is very to detect it in 
      // the E2E tests.
      this.onNew.emit($event);
    } else {
      // We assume the item of correct type is coming here.
      // If not the probability is very to detect it in 
      // the E2E tests.
      this.onUpdate.emit($event);
    }    
  }

  deleteHandler(item: Entity) {
    // We assume the item of correct type is coming here.
    // If not the probability is very to detect it in 
    // the E2E tests.
    this.onDelete.emit(item.id);    
  }

  editHandler(item: Entity) {
    this.onEdit.emit(item.id);
  }

  newHandler() {
    this.onNewBeforeSubmit.emit();
  }
  // --

}
