import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  input,
} from '@angular/core';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';

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
import {
  Age,
  PersonInterfaceComputed as EntityInterfaceComputed,
  PersonInterface as EntityInterface,
  BirthDate,
} from '@angular-monorepo/persons-management/domain';

import { PersonFormComponent as EntityFormComponent } from './person-form.component';
// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  DateAsString,
  daysToNexDue,
  getAgeInYears,
  getNextYearlyDue,
} from '@angular-monorepo/shared/util-common';

@Component({
  selector: 'persons-management-persons',
  standalone: true,
  imports: [
    // PrimeNG
    DialogModule,
    MessagesModule,

    // Own
    BasicTableComponent,
    CommonWrapperComponent,
    EntityFormComponent,
  ],
  template: `
    <h1>Birthdays of your friends</h1>
    <common-common-wrapper
      data-testid="all-birthdays"
      [messages]="messages()"
      [isLoading]="isListLoading()"
      [header]="'All birthdays'"
      [noData]="noData()"
    >
      <!-- TODO! Add the general static message component to the catalogue -->
      @if(areBirthdaysToday()) {
      <p-messages severity="info" data-testid="todays-birthdays-message">
        <ng-template pTemplate>
          <div data-testid="info-29-february">
            <b>NOTE!</b>
            <p>
              You have birthdays of your friends today! See the list of todays
              birthdays below.
            </p>
          </div>
        </ng-template>
      </p-messages>
      }
      <common-basic-table
        [columns]="columns"
        [data]="computedData()"
        [crud]="crud()"
        [isError]="isError()"
        (onDelete)="deleteHandler($event)"
        (onEdit)="editHandler($event)"
        (onNew)="newHandler()"
      ></common-basic-table>
    </common-common-wrapper>
    @if(areBirthdaysToday()) {
    <common-common-wrapper
      data-testid="todays-birthdays"
      [header]="'Todays birthdays'"
    >
      <common-basic-table
        [columns]="todaysBirthdaysColumns"
        [data]="todaysBirthdays()"
        [crud]="false"
      ></common-basic-table>
    </common-common-wrapper>
    }
    <!-- Generator template if CRUD is enabled -->
    @if (crud()) {
    <p-dialog
      [visible]="showEntityDialog()"
      [styleClass]="'w-23rem'"
      [modal]="true"
      [closable]="false"
      styleClass="p-fluid"
    >
      <ng-template pTemplate="content">
        <persons-management-person-form
          [data]="selectedEntity()"
          [allData]="data()"
          [header]="'Person'"
          [messages]="messages()"
          [isLoading]="isFormLoading()"
          [todaysDateAsString]="todaysDateAsString()"
          (onSubmit)="submitHandler($event)"
          (onCancel)="cancelHandler()"
        >
        </persons-management-person-form>
      </ng-template>
    </p-dialog>
    }
    <!-- Generator template -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonsComponent extends AbstractEntitiesListComponent<
  EntityInterfaceComputed,
  EntityInterface
> {
  todaysDateAsString = input.required<DateAsString>();

  computedData: Signal<EntityInterfaceComputed[]> = computed(() =>
    this.data()
      .map((item) => {
        const today: Date = new Date(this.todaysDateAsString());
        const age: Age = item.birthYear
          ? `${ getAgeInYears(today, new Date(`${item.birthYear}-${item.birthMonth}-${item.birthDay}`) ) }`
          : '-';

        const nextBirthday: Date = getNextYearlyDue(
          today,
          item.birthMonth,
          item.birthDay
        );
        const daysToBirthday: number = daysToNexDue(today, nextBirthday);

        const birthDay =
          item.birthDay < 10 ? `0${item.birthDay}` : `${item.birthDay}`;
        const birthMonth =
          item.birthMonth < 10 ? `0${item.birthMonth}` : `${item.birthMonth}`;

        const birthDate: BirthDate = item.birthYear
          ? `${birthDay}.${birthMonth}.${item.birthYear}`
          : `${birthDay}.${birthMonth}`;

        return {
          ...item,
          birthDate,
          age,
          daysToBirthday,
        };
      })
      .sort((a, b) => a.daysToBirthday - b.daysToBirthday)
      .map((item) => ({
        ...item,
        daysToBirthday:
          item.daysToBirthday === 0 ? 'today!' : item.daysToBirthday,
      }))
  );

  todaysBirthdays: Signal<EntityInterfaceComputed[]> = computed(() => {
    const today: Date = new Date(this.todaysDateAsString());
    return this.computedData().filter((item) => {
      const nextBirthday: Date = getNextYearlyDue(
        today,
        item.birthMonth,
        item.birthDay
      );
      return daysToNexDue(today, nextBirthday) === 0;
    });
  });

  areBirthdaysToday: Signal<boolean> = computed(
    () => this.todaysBirthdays().length > 0
  );

  protected override getColumns(): Array<
    [keyof EntityInterfaceComputed, string]
  > {
    // Adjusting the columns names and the sequence
    return [
      // Original columns
      ['name', 'Name'],
      ['surname', 'Surname'],
      // Computed columns
      ['birthDate', 'Birthday'],
      ['age', 'Age'],
      ['daysToBirthday', 'Days until'],
    ];
  }

  readonly todaysBirthdaysColumns: Array<
    [keyof EntityInterfaceComputed, string]
  > = this.getColumns().filter(
    (column) =>
      column[0] === 'name' || column[0] === 'surname' || column[0] === 'age'
  );
}
