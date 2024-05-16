import { ChangeDetectionStrategy, Component } from '@angular/core';
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
import { PersonInterface as EntityInterface } from '@angular-monorepo/shared-business/examples';
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  CommonWrapperComponent,
  AbstractEntityFormComponent,
} from '@angular-monorepo/shared/ui-common';

// -- STEP 1: Define the form types and options when necessary
type Status = 'INSTOCK' | 'OUTOFSTOCK' | 'LOWSTOCK';
interface StatusOption {
  name: string;
  value: Status;
}

@Component({
  selector: 'angular-monorepo-person-form',
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
  template: `<div class="flex justify-content-center" data-testid="person-form">
    <common-common-wrapper
      [messages]="formMessages()"
      [isLoading]="isLoading()"
      [header]="header()"
    >
      <!-- // -- STEP 2: Adjust the from template. -->
      <!-- You can use an AI-Solution like Copilot or Phind
        to generate the form template for you by providing the
        entity interface to the AI-Solution.
      -->
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
            data-testid="inventory-status-input"
            formControlName="inventoryStatus"
            [options]="inventoryStatusOptions"
            [panelStyleClass]="'dropdown-panel'"
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
        <div class="flex justify-content-end button-margin-top">
          <p-button
            label="Cancel"
            (click)="cancelHandler()"
            data-testid="cancel-button"
          ></p-button>
          <p-button
            label="Submit"
            [disabled]="isSubmitDisabled()"
            (click)="submitHandler()"
            data-testid="submit-button"
            class="button-margin-left"
          ></p-button>
        </div>
      </form>
    </common-common-wrapper>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonFormComponent extends AbstractEntityFormComponent<EntityInterface> {
  // -- STEP 3: adjust the form, you can use an AI-Solution
  // (e.g. Gibhub Copilot or Phind) for this by providing
  // the entity interface to it
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

  // -- STEP 4: adjust the options for the dropdown if necessary
  inventoryStatusOptions: StatusOption[] = [
    { name: 'In Stock', value: 'INSTOCK' },
    { name: 'Out of Stock', value: 'OUTOFSTOCK' },
    { name: 'Low Stock', value: 'LOWSTOCK' },
  ];

  // -- STEP 5: adjust the implementation of the form
  // validity
  override isEntityFormValid(): boolean {
    return this.entityForm.valid;
  }

  // -- STEP 6: adjust the form initialization
  protected override initForm(dataArg: EntityInterface | null): void {
    this.entityForm.get('id')?.disable();
    this.entityForm.get('code')?.disable();

    const data = { ...dataArg } as EntityInterface;
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

  // -- STEP 7: adjust the getting of the form value
  protected override getFormValue(): EntityInterface {
    const inventoryStatusValue: Status = this.entityForm.get('inventoryStatus')
      ?.value?.value as Status;
    const result: EntityInterface = {
      ...this.entityForm.getRawValue(),
      inventoryStatus: inventoryStatusValue,
    } as EntityInterface;

    return result;
  }
}
