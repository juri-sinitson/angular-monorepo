import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';
import { NgFor, KeyValuePipe, TitleCasePipe } from '@angular/common';

import { TableModule } from 'primeng/table';

import { TableColumn } from '../../types/table';

/**
 * A basic table component that displays a list of items in a table.
 */
@Component({
  selector: 'common-basic-table',
  standalone: true,
  imports: [TableModule, NgFor, KeyValuePipe],
  providers: [TitleCasePipe],
  template: `
    <!-- PrimeNG table -->
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
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr data-testid="row">
          <!-- Loop through the columns and display the item value -->
          @for (col of computedColumns(); track $index) {
            <td [attr.data-testid]="'val-' + col[0]">{{ item[col[0]] }}</td>
          }
        </tr>
      </ng-template>
    </p-table>
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

  constructor(private titleCasePipe: TitleCasePipe) {}
}
