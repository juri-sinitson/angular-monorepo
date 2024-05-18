import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {  
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,  
} from '@angular/forms';

// PrimeNG
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PersonInterface as EntityInterface } from '@angular-monorepo/persons-management/domain';
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  CommonWrapperComponent,
  AbstractEntityFormComponent,
} from '@angular-monorepo/shared/ui-common';
import { DateAsString, dateExists } from '@angular-monorepo/shared/util-common';

@Component({
  selector: 'persons-management-person-form',
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
    MessagesModule,

    // Own
    CommonWrapperComponent,
  ],
  template: `
  <div data-testid="entity-form"
    class="flex justify-content-center w-full">
    <common-common-wrapper class="w-full"
      [messages]="formMessages()"
      [isLoading]="isLoading()"
      [header]="header()"
    >
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
        <label for="surname">Surname</label>
        <input
          type="text"
          pInputText
          id="surname"
          formControlName="surname"
          data-testid="surname-input"
        />
      </div>

      <div class="flex flex-column gap-2 field-margin-top">
        <label for="birthDay">Birth Day</label>
        <p-inputNumber
          id="birthDay"
          data-testid="birth-day-input"
          formControlName="birthDay"
          mode="decimal"
          [showButtons]="true"
          [min]="1"
          [max]="31"
        ></p-inputNumber>
      </div>

      <div class="flex flex-column gap-2 field-margin-top">
        <label for="birthMonth">Birth Month</label>
        <p-inputNumber
          id="birthMonth"
          data-testid="birth-month-input"
          formControlName="birthMonth"
          mode="decimal"
          [showButtons]="true"
          [min]="1"
          [max]="12"
          [useGrouping]="false"
        ></p-inputNumber>
      </div>

      <div class="flex flex-column gap-2 field-margin-top">
        <label for="birthYear">Birth Year</label>
        <p-inputNumber
          id="birthYear"
          data-testid="birth-year-input"
          formControlName="birthYear"
          mode="decimal"
          [showButtons]="true"
          [min]="getMinYear()"
          [max]="getCurrentYear()"
          [useGrouping]="false"
        ></p-inputNumber>
      </div>
      @if(is29FebruaryWithoutYear()) {
        <!-- TODO! Add the general static message component to the catalogue -->
        <p-messages severity="info">
          <ng-template pTemplate>
            <div data-testid="info-29-february">
              <b>NOTE!</b>
              <p>
                This date exists in a leap year only.
              </p>
            </div>
          </ng-template>  
        </p-messages>  
      }
      @if(!changesMade()) {
        <!-- TODO! Add the general static message component to the catalogue -->
        <p-messages severity="info">
          <ng-template pTemplate>
            <div data-testid="no-changes">
              <b>No changes made yet!</b>
            </div>
          </ng-template>  
        </p-messages>
      }
      @if(!isExistingEntitySameAsEdited()) {
        <!-- TODO! Add the general static message component to the catalogue -->
        <p-messages severity="error">
          <ng-template pTemplate>
            <div data-testid="entity-already-exists">
              <b>THIS PERSON IS ALREADY IN THE DATABASE!</b>
              <p>
                It looks like you already have the person with 
                the same name, surname and birth date in the database. 
              </p>
            </div>
          </ng-template>  
        </p-messages>  
      }
      @if(dateExists() === false) {
        <!-- TODO! Add the general static message component to the catalogue -->
        <p-messages severity="error">
          <ng-template pTemplate>
            <div data-testid="date-does-not-exist">
              <b>THE DATE YOU PROVIDED DOESN'T EXIST!</b>
              <p>
                Make sure you provided the right combination of day and month or 
                of day, month and year. E.g. 31th of April does not exist and 29th 
                of February exists in a leap year only.
              </p>
            </div>
          </ng-template>  
        </p-messages>  
      }
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
  
  allData = input.required<EntityInterface[]>();
  todaysDateAsString = input.required<DateAsString>();  
  currentDate = computed<Date>(() => new Date(this.todaysDateAsString()));

  private birthDay!: AbstractControl;
  private birthMonth!: AbstractControl;
  private birthYear!: AbstractControl;  

  getCurrentYear(): number {
    return new Date(this.currentDate()).getFullYear();
  }

  getMinYear(): number {
    return this.getCurrentYear() - 150;
  }

  override isEntityFormValid(): boolean {
    return this.entityForm.valid;
  }

  is29FebruaryWithoutYear(): boolean {
    const day: number | null = this.getControlValueByPath('birthDay', this.entityForm);
    const month: number | null = this.getControlValueByPath('birthMonth', this.entityForm);
    const year: number | null = this.getControlValueByPath('birthYear', this.entityForm);
  
    return day === 29 && month === 2 && !year;
  }
  
  // TODO! Memoize to avoid unnecessary loops.
  protected override getExistingEntity(): EntityInterface | undefined {
    
    return (this.allData() as EntityInterface[]).find(
      (person: EntityInterface) => {

        const areSurnamesEqual = this.compareValuesWhichCanBeEmpty(
          person.surname, 
          this.getControlValueByPath('surname', this.entityForm), 
          undefined, 
          ''
        );

        const areBirthYearsEqual = this.compareValuesWhichCanBeEmpty(
          person.birthYear, 
          this.getControlValueByPath('birthYear', this.entityForm), 
          undefined, 
          null
        );

        return person.name === this.getControlValueByPath('name', this.entityForm)
          && areSurnamesEqual
          && person.birthDay === this.getControlValueByPath('birthDay', this.entityForm)
          && person.birthMonth === this.getControlValueByPath('birthMonth', this.entityForm)
          && areBirthYearsEqual;
      });
  }

  protected override initForm(dataArg: EntityInterface | null): void {
    
    this.birthDay = new FormControl<number | null>(null, [
      Validators.required, 
      Validators.min(1), 
      Validators.max(31),
    ]);
  
    this.birthMonth = new FormControl<number | null>(null, [
      Validators.required, 
      Validators.min(1), 
      Validators.max(12),
    ]);
  
    this.birthYear = new FormControl<number | undefined>(undefined, [
      Validators.min(this.getMinYear()), 
      Validators.max(this.getCurrentYear()),
    ]);
  
    this.entityForm.addControl('id', new FormControl<string | number>('0', { nonNullable: true }));
    this.entityForm.addControl('name', new FormControl<string>('', [Validators.required]));
    this.entityForm.addControl('surname', new FormControl<string | undefined>(undefined, ));
    this.entityForm.addControl('birthDay', this.birthDay);
    this.entityForm.addControl('birthMonth', this.birthMonth);
    this.entityForm.addControl('birthYear', this.birthYear);

    const multiFieldValidators: ValidatorFn[] = [
      this.existingEntityMultiFieldValidator(),
      this.dateMultiFieldValidator()
    ];
    
    this.entityForm.get('id')?.disable();
    this.entityForm.patchValue({...dataArg});
    this.entityForm.addValidators(multiFieldValidators);
  }

  protected override getFormValue(): EntityInterface {
    return this.entityForm.getRawValue() as EntityInterface
  }

  dateExists(): boolean | null {        
    
    const birthDay: number | null = this.getControlValueByPath('birthDay', this.entityForm);
    const birthMonth: number | null = this.getControlValueByPath('birthMonth', this.entityForm);
    const birthYear: number | null = this.getControlValueByPath('birthYear', this.entityForm);
    
    if(!birthDay || !birthMonth) {
      return null;
    }
    
    return dateExists(birthDay, birthMonth, birthYear);
  }


  protected dateMultiFieldValidator(): ValidatorFn {
      
    return (): ValidationErrors | null => {

      const day: number | undefined = this.getControlValue(this.birthDay);
      const month: number | undefined = this.getControlValue(this.birthMonth);
      const year: number | undefined = this.getControlValue(this.birthYear);
    
      let result: ValidationErrors | null = null;
      const validationFail = { invalidDate: true };
  
      if (!day || !month) {
        result = validationFail;
      } else {
        const dateExistsOrNotReady = dateExists(day, month, year) !== false;
        result = dateExistsOrNotReady ? null : validationFail;
      }

      return result;
    };
  }

}
