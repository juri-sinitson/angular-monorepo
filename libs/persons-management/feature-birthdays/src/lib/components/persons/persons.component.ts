import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DialogModule } from 'primeng/dialog';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  BasicTableComponent,
  CommonWrapperComponent,
} from '@angular-monorepo/shared/ui-common';
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AbstractEntitiesListComponent } from '@angular-monorepo/shared/ui-common';

// -- STEP 1: ADJUST THE ENTITY INTERFACE PATH! --
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PersonInterface as EntityInterface } from '@angular-monorepo/shared-business/examples';
import { PersonFormComponent as EntityFormComponent } from './person-form.component';

@Component({
  selector: 'angular-monorepo-persons',
  standalone: true,
  imports: [
    // PrimeNG
    DialogModule,

    // Own
    BasicTableComponent,
    CommonWrapperComponent,
    EntityFormComponent,
  ],
  template: `
    <common-common-wrapper
      [messages]="messages()"
      [isLoading]="isListLoading()"
      [header]="header()"
      [noData]="noData()"
    >
      <common-basic-table
        [columns]="columns"
        [data]="data()"
        [crud]="crud()"
        [isError]="isError()"
        (onDelete)="deleteHandler($event)"
        (onEdit)="editHandler($event)"
        (onNew)="newHandler()"
      ></common-basic-table>
    </common-common-wrapper>
    <!-- Generator template if CRUD is enabled -->
    @if (crud()) {
    <p-dialog
      [visible]="showEntityDialog()"
      [style]="{ width: '450px' }"
      [modal]="true"
      [closable]="false"
      styleClass="p-fluid"
    >
      <ng-template pTemplate="content">
        <angular-monorepo-person-form
          [data]="selectedEntity()"
          [header]="'Person'"
          [messages]="messages()"
          [isLoading]="isFormLoading()"
          (onSubmit)="submitHandler($event)"
          (onCancel)="cancelHandler()"
        >
        </angular-monorepo-person-form>
      </ng-template>
    </p-dialog>
    }
    <!-- Generator template -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonsComponent extends AbstractEntitiesListComponent<PersonInterface> {
  protected override getColumns(): Array<[keyof EntityInterface, string]> {
    // -- STEP 2: ADJUST THE COLUMNS NAMES AND THE SEQUENCE!
    // Adjusting the columns names and the sequence
    return [
      ['name', 'Name'],
      ['category', 'Category'],
      ['description', 'Description'],
      ['inventoryStatus', 'Status'],
      ['code', 'Code'],
      ['price', 'Price'],
      ['quantity', 'Quantity'],
      ['rating', 'Rating'],
    ];
  }
}