import { ChangeDetectionStrategy, Component } from '@angular/core';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { 
  BasicTableComponent,
  CommonWrapperComponent,
} from '@angular-monorepo/shared/ui-common';
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AbstractEntitiesListComponent } from '@angular-monorepo/shared/ui-common';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface as EntityInterface } from '@angular-monorepo/shared-business/examples';
import { ProductFormComponent } from './product-form.component';

@Component({
  selector: 'angular-monorepo-products',
  standalone: true,
  providers: [
    // PrimeNG
    ConfirmationService,
  ],
  imports: [
    // PrimeNG
    ConfirmDialogModule,
    DialogModule,
    
    // Own
    BasicTableComponent, 
    CommonWrapperComponent,
    ProductFormComponent,    
    ],
    template: `
    <common-common-wrapper 
      [messages]="messages()" 
      [isLoading]="isLoading()"
      [header]="header()"
      [noData]="noData()"
    >
      <common-basic-table 
        [columns]="columns" 
        [data]="data()"
        [crud]="true"
        (onDelete)="deleteHandler($event)"
        (onEdit)="editHandler($event)"
      ></common-basic-table>
    </common-common-wrapper>
    <!-- Generator template if CRUD is enabled -->
    @if (crud()) {
      <p-dialog 
        [(visible)]="showEntityDialog" 
        [style]="{ width: '450px' }"        
        [modal]="true"
        styleClass="p-fluid">
          <ng-template pTemplate="content">
            <angular-monorepo-product-form 
              [header]="'Product'"
              [data]="currentEntity"
              (onSubmit)="submitHandler($event)"
              (onCancel)="cancelHandler()"
            >
          </angular-monorepo-product-form>
          </ng-template>
      </p-dialog>
      <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
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
