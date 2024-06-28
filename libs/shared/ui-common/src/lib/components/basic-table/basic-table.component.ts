import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  output,
} from '@angular/core';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';

import { TableColumn } from '../../types/table';
import { Entity } from '@angular-monorepo/shared/util-common';

/**
 * A basic table component that displays a list of items in a table.
 */
@Component({
  selector: 'common-basic-table',
  standalone: true,
  imports: [
    // Angular
    KeyValuePipe,

    // PrimeNG
    TableModule, 
    ButtonModule,
    ConfirmDialogModule,
    ToolbarModule,
  ],
  providers: [
    // Angular
    TitleCasePipe,
    
    // PrimeNg
    ConfirmationService,
  ],
  template: `
    @if (crud()) {
      <p-toolbar styleClass="mb-4 gap-2">
        <ng-template pTemplate="left"></ng-template>  
        <ng-template pTemplate="right">
          <button 
              pRipple
              pButton
              data-testid="new-button"
              severity="success" 
              [disabled]="isError()"
              label="New" 
              icon="pi pi-plus" 
              class="mr-2" 
              (click)="newHandler()"
            >
          </button>
        </ng-template>
      </p-toolbar>
    }
    <p-table [value]="data()" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template pTemplate="header">
        <tr>
          <!-- Loop through the columns and display the column name -->
          <!-- 
            NOTE: We leave the columns even if there are no items
            to have a certain width and to avoid big layout 
            rearrangements in the layout when the data arrives.
          -->
          @for (col of computedColumns(); track $index) {
            <th [attr.data-testid]="'col-' + col[0]">{{ col[1] }}</th>
          }
          @if (crud()) {
            <th></th>
          }
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr data-testid="row">
          <!-- Loop through the columns and display the item value -->
          @for (col of computedColumns(); track $index) {
            <td [attr.data-testid]="'val-' + col[0]">{{ item[col[0]] }}</td>
          }
          @if (crud()) {
            <td data-testid="crud">
              <button pButton pRipple data-testid="edit" 
                [disabled]="isError()"
                icon="pi pi-pencil" 
                class="p-button-rounded p-button-success mr-2"
                (click)="edit(item)">
              </button>
              <button pButton pRipple data-testid="delete"
                [disabled]="isError()" 
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning"
                (click)="delete(item)">
              </button>
            </td>
          }
        </tr>
      </ng-template>
    </p-table>
    <!-- TODO! unify the dialog max width with a utility class -->
    <p-confirmDialog [style]="{ maxWidth: '450px' }" [styleClass]="'confirm-dialog'"></p-confirmDialog>    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicTableComponent {
  /**
   * The items to display in the table.
   */
  data = input.required<object[]>();
  /**
   * The columns to display in the table.
   * The name of the column is mapped to 
   * the key of the object.
   */
  columns = input<TableColumn | undefined>();

  isError = input<boolean>(false);

  /**
  * If it's a CRUD table or not.
  */
  crud = input<boolean>(false);

  onDelete = output<Entity>();
  onEdit = output<Entity>();
  onNew = output();
  
  computedColumns = computed<TableColumn>(() => {
    
    // If the columns input is provided, use it.
    const columns = this.columns() ?? [];
    if (this.columns()) {
      return columns;
    }
    
    // If the columns input is not provided,
    // generate the columns input from the first item.
    const result: TableColumn = [];
    // TODO!
    // Add a story for empty data with and without
    // columns input. 
    const keys = Object.keys(this.data()[0] ?? {});
    keys.forEach((key: string) => {
      result.push([key, this.titleCasePipe.transform(key)]);
    });
    
    return result;
  });

  constructor(
    private titleCasePipe: TitleCasePipe,
    private confirmationService: ConfirmationService
  ) {}

  newHandler() {
    this.onNew.emit();
  }

  delete(item: Entity) {    
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDelete.emit(item);
      }
    });
  }

  edit(item: Entity) {
    this.onEdit.emit(item);
  }
}
