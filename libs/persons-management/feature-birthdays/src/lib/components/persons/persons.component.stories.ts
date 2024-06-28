import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { expect } from '@storybook/test';

import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { PersonsComponent as EntitiesComponent } from './persons.component';
import { PersonInterface as EntityInterface } from '@angular-monorepo/persons-management/domain';
import {
  DateAsString,
  MessageInterface,
  rootComponentConfigBase as commonAppConfig,
} from '@angular-monorepo/shared/util-common';
import {
  errorStory,
  getFirstElemByText,
  expectText,
  loadingStory,
  noDataStory,
  ConfirmNotImplementedWrapperComponent,
  primaryTableStory,
  getCanvas,
  expectNoElem,
  getSubCanvasByTestId,
  expectElem,
  countElemsByText,
} from '@angular-monorepo/shared/util-common-non-prod';

const header = 'Birthdays of your friends';
const todaysDate: DateAsString = '2024-03-15';

const entitiesList: EntityInterface[] = [
  {
    id: '1006',
    name: 'John',
    surname: 'Doe',
    birthDay: 15,
    birthMonth: 6,
    birthYear: 1990,
  },
  {
    id: '1007',
    name: 'Jane',
    surname: 'Smith',
    birthDay: 10,
    birthMonth: 9,
    birthYear: 1985,
  },
  {
    id: '1010',
    name: 'David',
    surname: 'Jackson',
    birthDay: 17,
    birthMonth: 3,
  },
  {
    id: '1008',
    name: 'Michael',
    surname: 'Johnson',
    birthDay: 16,
    birthMonth: 3,
    birthYear: 1995,
  },
  {
    id: '1009',
    name: 'Sarah',
    surname: 'Williams',
    birthDay: 12,
    birthMonth: 7,
  },
];

const withTodaysBirthdays = (): EntityInterface[] => {
  const temp = entitiesList.map((entity) => ({ ...entity }));
  return temp.map((entity, index) => {
    if (index > 2) {
      entity.birthDay = 15;
      entity.birthMonth = 3;
    }
    return entity;
  });
};

@Component({
  selector: 'persons-management-persons-test-wrapper',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    // PrimeNG
    ConfirmDialogModule,

    // Own
    EntitiesComponent,
  ],
  template: `
    <persons-management-persons
      [todaysDateAsString]="todaysDateAsString"
      [data]="data"
      [messages]="messages"
      [isLoading]="isLoading"
      [header]="header"
      [noData]="noData"
      [crud]="true"
      (onDelete)="crudOperationHandler('Data deletion')"
      (onEdit)="crudOperationHandler('Data editing')"
      (onNewBeforeSubmit)="crudOperationHandler('Data submitting')"
      (onNew)="crudOperationHandler('Data submitting')"
      (onUpdate)="crudOperationHandler('Data submission')"
    >
    </persons-management-persons>
    <p-confirmDialog [styleClass]="'w-23rem'"></p-confirmDialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityWrapperComponent extends ConfirmNotImplementedWrapperComponent {
  todaysDateAsString = todaysDate;
  @Input() data: EntityInterface[] = [];
  @Input() messages: MessageInterface[] = [];
  @Input() isLoading = false;
  @Input() noData = false;
  @Input() header: string | undefined = undefined;
}

const meta: Meta<EntityWrapperComponent> = {
  component: EntityWrapperComponent,
  decorators: [applicationConfig({ ...commonAppConfig })],
  title: 'persons-management/feature-birthdays/Persons',
};
export default meta;
type Story = StoryObj<EntityWrapperComponent>;

const expectCols = async (canvas: HTMLElement) => {
  await expectText('Name', canvas);
  await expectText('Surname', canvas);
  await expectText('Birthday', canvas);
  await expectText('Age', canvas);
  await expectText('Days until', canvas);
};

const expectValues = async (canvas: HTMLElement) => {
  await expectText('John', canvas);
  await getFirstElemByText('Doe', canvas);
  await getFirstElemByText('15.06.1990', canvas);  
  await getFirstElemByText('33', canvas);
  await getFirstElemByText('92', canvas);

  await expectText('David', canvas);
  await getFirstElemByText('Jackson', canvas);
  await getFirstElemByText('17.03', canvas);
  await getFirstElemByText('-', canvas);
  await getFirstElemByText('2', canvas);

  await expectText('Jane', canvas);
  await getFirstElemByText('Smith', canvas);
  await getFirstElemByText('10.09.1985', canvas);
  await getFirstElemByText('38', canvas);
  await getFirstElemByText('179', canvas);
};

export const Primary: Story = {
  args: { ...primaryTableStory.args, data: entitiesList, header },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const parentCanvas = getCanvas(canvasElement);
    const canvas = await getSubCanvasByTestId('all-birthdays', parentCanvas);

    await expectCols(canvas);
    await expectValues(canvas);

    // WE don't expect todays birthdays
    await expectNoElem('todays-birthdays', parentCanvas);
    await expectNoElem('todays-birthdays-message', canvas);

    // No loading, error, etc.
    await expectNoElem('loading', canvas);
    await expectNoElem('messages', canvas);
    await expectNoElem('no-data', canvas);
  },
};

export const todaysBirthdays: Story = {
  args: { ...primaryTableStory.args, data: withTodaysBirthdays(), header },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const parentCanvas = getCanvas(canvasElement);
    const allBirthDaysCanvas = await getSubCanvasByTestId(
      'all-birthdays',
      parentCanvas
    );
    const todaysBirthdaysCanvas = await getSubCanvasByTestId(
      'todays-birthdays',
      parentCanvas
    );

    await expectCols(allBirthDaysCanvas);
    await expectValues(allBirthDaysCanvas);

    // WE expect todays birthdays
    await expectElem('todays-birthdays-message', allBirthDaysCanvas);
    await expect(await countElemsByText('today!', allBirthDaysCanvas)).toBe(2);
    await expectElem('todays-birthdays', parentCanvas);

    await expectText('Name', todaysBirthdaysCanvas);
    await expectText('Surname', todaysBirthdaysCanvas);
    await expectText('Age', todaysBirthdaysCanvas);

    await getFirstElemByText('Sarah', todaysBirthdaysCanvas);
    await getFirstElemByText('Williams', todaysBirthdaysCanvas);
    await getFirstElemByText('-', todaysBirthdaysCanvas);

    await getFirstElemByText('Michael', todaysBirthdaysCanvas);
    await getFirstElemByText('Johnson', todaysBirthdaysCanvas);
    await getFirstElemByText('29', todaysBirthdaysCanvas);

    // No loading, error, etc.
    await expectNoElem('loading', parentCanvas);
    await expectNoElem('messages', parentCanvas);
    await expectNoElem('no-data', parentCanvas);
  },
};

export const Loading: Story = {
  args: {
    ...loadingStory.args,
    data: entitiesList,
    header,
  },
  play: loadingStory.play,
};

export const Error: Story = {
  args: { ...errorStory.args, header },
  play: errorStory.play,
};

export const noData: Story = {
  args: { ...noDataStory.args, header },
  play: noDataStory.play,
};
