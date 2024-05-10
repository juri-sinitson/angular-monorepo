import { Component, input, output } from "@angular/core";

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from "@angular-monorepo/shared/util-common";
import { Entity } from "../../types/entity";

@Component({template: ``,})
export abstract class AbstractEntitiesListComponent<T extends Entity> {
  data = input.required<T[]>();
  messages = input<MessageInterface[]>([]);
  isLoading = input<boolean>(false);
  noData = input<boolean>(false);
  header = input<string | undefined>(undefined);  
  crud = input<boolean>(false);
  readonly columns!: Array<[keyof T, string]>;

  // -- CRUD
  isError = input<boolean>(false);
  onDelete = output<Entity>();
  onUpdate = output<Entity>();
  onNew = output<Entity>();

  currentEntity: T | null = null;  
  showEntityDialog = false;

  protected isNewEntity = false;
  // --

  protected abstract getColumns(): Array<[keyof T, string]>;

  constructor() {     
    this.columns = this.getColumns();
  }

  // -- CRUD
  cancelHandler() {
    this.showEntityDialog = false;
  }
  
  submitHandler($event: T) {
    if (this.isNewEntity) {
      // We assume the item of correct type is coming here.
      // If not we will most probably detect it in 
      // the E2E tests.
      this.onNew.emit($event);
    } else {
      // We assume the item of correct type is coming here.
      // If not we will most probably detect it in 
      // the E2E tests.
      this.onUpdate.emit($event);
    }
    
    if(!this.isLoading() && !this.isError()) {
      this.showEntityDialog = false;
    }
  }

  deleteHandler(item: Entity) {
    // We assume the item of correct type is coming here.
    // If not we will most probably detect it in 
    // the E2E tests.
    this.onDelete.emit(item as T);    
  }

  editHandler(item: Entity) {
    // We assume the item of correct type is coming here.
    // If not we will most probably detect it in 
    // the E2E tests.
    this.currentEntity = item as T;
    
    this.showEntityDialog = true;
    this.isNewEntity = false;        
  }
  // --

}
