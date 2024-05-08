import { Component, input } from "@angular/core";

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from "@angular-monorepo/shared/util-common";

@Component({template: ``,})
export abstract class AbstractEntitiesListComponent<T> {
  data = input.required<T[]>();
  messages = input<MessageInterface[]>([]);
  isLoading = input<boolean>(false);
  noData = input<boolean>(false);
  header = input<string | undefined>(undefined);  
  readonly columns!: Array<[keyof T, string]>;

  protected abstract getColumns(): Array<[keyof T, string]>;

  constructor() {     
    this.columns = this.getColumns();
  }
}
