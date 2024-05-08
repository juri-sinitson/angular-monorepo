import { Component, Input, output } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface } from '@angular-monorepo/shared-business/examples';
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CommonWrapperComponent } from '@angular-monorepo/shared/ui-common';

type Status = 'INSTOCK' | 'OUTOFSTOCK' | 'LOWSTOCK';
interface StatusOption {
  name: string;
  value: Status;
}

@Component({
  selector: 'angular-monorepo-product-form',
  standalone: true,
  imports: [
    // Angular
    FormsModule,
    ReactiveFormsModule,

    // PrimeNG
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,

    // Own
    CommonWrapperComponent,
  ],
  template: ` <div class="flex justify-content-center">
    <common-common-wrapper>
      <form [formGroup]="entityForm" data-testid="form">
        <div class="flex flex-column gap-2">
          <label for="id">ID</label>
          <input
            type="text"
            pInputText
            id="id"
            formControlName="id"
            data-testid="id-input"
          />
        </div>

        <div class="flex flex-column gap-2 field-margin-top">
          <label for="code">Code</label>
          <input
            type="text"
            pInputText
            id="code"
            formControlName="code"
            data-testid="code-input"
          />
        </div>

        <div class="flex flex-column gap-2 field-margin-top">
          <label for="name">Name</label>
          <input
            type="text"
            pInputText
            id="name"
            formControlName="name"
            data-testid="name-input"
          />
        </div>

        <div class="flex flex-column gap-2 field-margin-top">
          <label for="description">Description</label>
          <input
            type="text"
            pInputText
            id="description"
            formControlName="description"
            data-testid="description-input"
          />
        </div>

        <div class="flex flex-column gap-2 field-margin-top">
          <label for="price">Price</label>
          <p-inputNumber
            id="price"
            formControlName="price"
            mode="currency"
            currency="EUR"
            data-testid="price-input"
          ></p-inputNumber>
        </div>

        <div class="flex flex-column gap-2 field-margin-top">
          <label for="category">Category</label>
          <input
            type="text"
            pInputText
            id="category"
            formControlName="category"
            data-testid="category-input"
          />
        </div>

        <div class="flex flex-column gap-2 field-margin-top">
          <label for="quantity">Quantity</label>
          <p-inputNumber
            id="quantity"
            data-testid="quantity-input"
            formControlName="quantity"
            mode="decimal"
            [showButtons]="true"
            [min]="1"
            [max]="100"
          ></p-inputNumber>
        </div>

        <div class="flex flex-column gap-2 field-margin-top">
          <label for="inventoryStatus">Inventory Status</label>
          <p-dropdown
            id="inventoryStatus"
            data-testid="inventoryStatus-input"
            formControlName="inventoryStatus"
            [options]="inventoryStatusOptions"
            optionLabel="name"
            placeholder="Select Inventory Status"
          ></p-dropdown>
        </div>

        <div class="flex flex-column gap-2 field-margin-top">
          <label for="rating">Rating</label>
          <p-inputNumber
            id="rating"
            data-testid="rating-input"
            formControlName="rating"
            mode="decimal"
            [showButtons]="true"
            [min]="1"
            [max]="5"
          ></p-inputNumber>
        </div>
      </form>
      <div class="flex justify-content-end button-margin-top">
        <p-button
          label="Submit"
          [disabled]="!entityForm.valid"
          (click)="submitHandler()"
          data-testid="submit-button"
        ></p-button>
      </div>
    </common-common-wrapper>
  </div>`,
})
export class ProductFormComponent {
  @Input() set data(data: ProductInterface | null) {
    if (!data) {
      this.entityForm.reset();
    } else {
      const statusOption = this.inventoryStatusOptions.find(
        (option) => option.value === data.inventoryStatus
      );

      this.entityForm.patchValue({
        ...data,
        inventoryStatus: statusOption,
      });
    }
  }

  onSubmit = output<ProductInterface>();

  entityForm = new FormGroup({
    id: new FormControl<string>('0', { nonNullable: true }),
    code: new FormControl<string>('-', { nonNullable: true }),
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required]),
    category: new FormControl<string>('', [Validators.required]),
    quantity: new FormControl<number | null>(null, [Validators.required]),
    inventoryStatus: new FormControl<StatusOption | null>(null, [
      Validators.required,
    ]),
    rating: new FormControl<number | null>(null, [Validators.required]),
  });

  inventoryStatusOptions: StatusOption[] = [
    { name: 'In Stock', value: 'INSTOCK' },
    { name: 'Out of Stock', value: 'OUTOFSTOCK' },
    { name: 'Low Stock', value: 'LOWSTOCK' },
  ];

  constructor() {
    this.entityForm.get('id')?.disable();
    this.entityForm.get('code')?.disable();
  }

  submitHandler() {
    this.onSubmit.emit(this.getFormValue());
  }

  private getFormValue(): ProductInterface {
    const inventoryStatusValue: Status = this.entityForm.get('inventoryStatus')
      ?.value?.value as Status;
    const result: ProductInterface = {
      ...this.entityForm.getRawValue(),
      inventoryStatus: inventoryStatusValue,
    } as ProductInterface;

    return result;
  }
}
