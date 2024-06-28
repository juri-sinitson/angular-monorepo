import { Component, Input } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import {
  Meta,
  StoryObj,
  applicationConfig,
  componentWrapperDecorator,
} from '@storybook/angular';

import {
  getCanvas,
  ConfirmNotImplementedWrapperComponent,
  expectTextInputValue,
  expectNumberInputValue,
  expectFormInvalidByTextInput,
  expectFormValid,
  expectFormInvalid,
  loadingStory,
  errorStory,
  expectElem,
  typeToTextInput,
  expectNoElem,
  expectSubmitButtonDisabled,
  clearTextInput,
  clearNumberInput,
} from '@angular-monorepo/shared/util-common-non-prod';

import {
  MessageInterface,
  rootComponentConfigBase as commonAppConfig,
} from '@angular-monorepo/shared/util-common';

import { PersonInterface as EntityInterface } from '@angular-monorepo/persons-management/domain';
import { PersonFormComponent as EntityFormComponent } from './person-form.component';

const header = 'Person';

@Component({
  selector: 'persons-management-person-form-wrapper',
  standalone: true,
  imports: [
    // PrimeNG
    ConfirmDialogModule,

    // Own
    EntityFormComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <persons-management-person-form
      [data]="data"
      [allData]="allData"
      [messages]="messages"
      [isLoading]="isLoading"
      [todaysDateAsString]="'2023-03-01'"
      [header]="header"
      (onSubmit)="crudOperationHandler('Data submitting')"
      (onCancel)="cancelHandler()"
    ></persons-management-person-form>
    <p-confirmDialog [styleClass]="'w-23rem'"></p-confirmDialog>
  `,
})
class EntityFormWrapperComponent extends ConfirmNotImplementedWrapperComponent {
  @Input() allData: EntityInterface[] = [];
  @Input() data: EntityInterface | null = null;
  @Input() messages: MessageInterface[] = [];
  @Input() isLoading = false;
  @Input() header: string | undefined = undefined;
}

const meta: Meta<EntityFormWrapperComponent> = {
  component: EntityFormWrapperComponent,
  decorators: [
    applicationConfig({ ...commonAppConfig }),
    componentWrapperDecorator((story) => `<div class="w-23rem">${story}</div>`),
  ],
  title: 'persons-management/feature-birthdays/Person Form',
};
export default meta;
type Story = StoryObj<EntityFormWrapperComponent>;

const singleEntity: EntityInterface = {
  id: '1006',
  name: 'John',
  surname: 'Doe',
  birthDay: 1,
  birthMonth: 3,
  birthYear: 1994,
};

const allData: EntityInterface[] = [
  {
    id: '1007',
    name: 'Jane',
    surname: 'Smith',
    birthDay: 2,
    birthMonth: 5,
    birthYear: 1990,
  },
  {
    id: '1008',
    name: 'Michael',
    surname: 'Johnson',
    birthDay: 15,
    birthMonth: 9,
    birthYear: 1985,
  },
  {
    id: '1009',
    name: 'Emily',
    surname: 'Brown',
    birthDay: 10,
    birthMonth: 12,
    birthYear: 1998,
  },
  { id: '1010', name: 'David', birthDay: 20, birthMonth: 6 },
];

export const primary: Story = {
  args: {
    header,
    data: singleEntity,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectElem('no-changes', canvas);
    await expectNoElem('info-29-february', canvas);
    await expectNoElem('date-does-not-exist', canvas);
    await expectNoElem('entity-already-exists', canvas);
    await expectFormValid(canvas, false);
    await expectSubmitButtonDisabled(canvas);
  },
};

export const updateEntity: Story = {
  args: {
    header,
    data: { ...allData[0] },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    await expectTextInputValue('id-input', '1007', canvas);
    await expectTextInputValue('name-input', 'Jane', canvas);
    await expectTextInputValue('surname-input', 'Smith', canvas);
    await expectNumberInputValue('birth-day-input', '2', canvas);
    await expectNumberInputValue('birth-month-input', '5', canvas);
    await expectNumberInputValue('birth-year-input', '1990', canvas);
    await expectFormValid(canvas, false);
    await expectSubmitButtonDisabled(canvas);
    await expectNoElem('entity-already-exists', canvas);

    // testing the invalidity of the form
    await expectFormInvalidByTextInput('name-input', canvas);
    await expectFormInvalidByTextInput('birth-day-input', canvas);
    await expectFormInvalidByTextInput('birth-month-input', canvas);
  },
};

export const newEntity: Story = {
  args: {
    header,
    data: null,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    await expectTextInputValue('id-input', '0', canvas);
    await expectTextInputValue('name-input', '', canvas);
    await expectTextInputValue('surname-input', '', canvas);
    await expectNumberInputValue('birth-day-input', '', canvas);
    await expectNumberInputValue('birth-month-input', '', canvas);
    await expectNumberInputValue('birth-year-input', '', canvas);
    await expectFormInvalid(canvas);
  },
};

export const february29: Story = {
  args: {
    header,
    data: {
      ...singleEntity,
      birthDay: 29,
      birthMonth: 2,
      birthYear: undefined,
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    // -- STEP 5: adjust the form fields and the data
    await expectTextInputValue('id-input', '1006', canvas);
    await expectTextInputValue('name-input', 'John', canvas);
    await expectTextInputValue('surname-input', 'Doe', canvas);
    await expectNumberInputValue('birth-day-input', '29', canvas);
    await expectNumberInputValue('birth-month-input', '2', canvas);
    await expectNumberInputValue('birth-year-input', '', canvas);
    await expectElem('info-29-february', canvas);
    await expectElem('no-changes', canvas);
    await expectFormValid(canvas, false);
    await expectSubmitButtonDisabled(canvas);
  },
};

export const dateDoesNotExist: Story = {
  args: {
    header,
    data: { ...singleEntity, birthMonth: 4, birthYear: undefined },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    // -- STEP 5: adjust the form fields and the data
    await expectTextInputValue('id-input', '1006', canvas);
    await expectTextInputValue('name-input', 'John', canvas);
    await expectTextInputValue('surname-input', 'Doe', canvas);
    await expectNumberInputValue('birth-day-input', '1', canvas);
    await expectNumberInputValue('birth-month-input', '4', canvas);
    await expectNumberInputValue('birth-year-input', '', canvas);
    await typeToTextInput('birth-day-input', '31', canvas);
    await expectElem('date-does-not-exist', canvas);
    await expectFormInvalid(canvas);
  },
};

export const alreadyExists: Story = {
  args: {
    header,
    allData,
    data: { ...allData[0] },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);

    await expectTextInputValue('id-input', '1007', canvas);
    await expectTextInputValue('name-input', 'Jane', canvas);
    await expectTextInputValue('surname-input', 'Smith', canvas);
    await expectNumberInputValue('birth-day-input', '2', canvas);
    await expectNumberInputValue('birth-month-input', '5', canvas);
    await expectNumberInputValue('birth-year-input', '1990', canvas);
    await expectElem('no-changes', canvas);

    // Provoking invalidation by full data
    await typeToTextInput('name-input', 'Michael', canvas);
    await typeToTextInput('surname-input', 'Johnson', canvas);
    await typeToTextInput('birth-day-input', '15', canvas);
    await typeToTextInput('birth-month-input', '9', canvas);
    await typeToTextInput('birth-year-input', '1985', canvas);
    await expectElem('entity-already-exists', canvas);
    await expectFormInvalid(canvas);

    // Provoking invalidation by minimal necessary data
    await typeToTextInput('name-input', 'David', canvas);
    await clearTextInput('surname-input', canvas);
    await typeToTextInput('birth-day-input', '20', canvas);
    await typeToTextInput('birth-month-input', '6', canvas);
    await clearNumberInput('birth-year-input', canvas, true);
    await expectElem('entity-already-exists', canvas);
    await expectFormInvalid(canvas);
  },
};

export const Loading: Story = {
  args: {
    ...loadingStory.args,
    data: singleEntity,
    header,
  },
  play: loadingStory.play,
};

export const Error: Story = {
  args: { ...errorStory.args, data: singleEntity, header },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);
    // making the form dirty to avoid additional
    // messages in the dirty state
    await typeToTextInput('birth-month-input', '5', canvas);
    await expectNoElem('no-changes', canvas);

    if (errorStory.play) {
      await errorStory.play({ canvasElement });
    }
  },
};
