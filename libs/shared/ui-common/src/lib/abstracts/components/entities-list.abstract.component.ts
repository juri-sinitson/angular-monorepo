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
  readonly columns!: Array<[keyof T, string]>;

  // -- CRUD
  /**
   * Emits the item on delete
   */
  onDelete = output<Entity>();
  /**
   * Emits the item on edit
   */
  onEdit = output<Entity>();
  // --

  protected abstract getColumns(): Array<[keyof T, string]>;

  constructor() {     
    this.columns = this.getColumns();
  }

  // -- CRUD
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
    this.onEdit.emit(item as T);
  }
  // --

}
