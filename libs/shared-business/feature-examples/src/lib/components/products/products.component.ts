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

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface as EntityInterface } from '@angular-monorepo/shared-business/examples';
import { ProductFormComponent as EntityFormComponent } from './product-form.component';

@Component({
  selector: 'angular-monorepo-products',
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
        <angular-monorepo-product-form
          [data]="selectedEntity()"
          [header]="'Product'"
          [messages]="messages()"
          [isLoading]="isFormLoading()"
          (onSubmit)="submitHandler($event)"
          (onCancel)="cancelHandler()"
        >
        </angular-monorepo-product-form>
      </ng-template>
    </p-dialog>
    }
    <!-- Generator template -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent extends AbstractEntitiesListComponent<EntityInterface> {
  protected override getColumns(): Array<[keyof EntityInterface, string]> {
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
