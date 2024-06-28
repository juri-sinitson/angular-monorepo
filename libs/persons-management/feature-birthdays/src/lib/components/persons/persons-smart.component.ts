import { ChangeDetectionStrategy, Component, inject } from '@angular/core';


import { PersonEntityStoreService as EntityStoreService } from '@angular-monorepo/persons-management-api-persons';
import { PersonsComponent as EntityComponent } from './persons.component';

const entityHeader = 'Persons';

@Component({
  selector: 'persons-management-persons-smart',
  standalone: true,
  imports: [EntityComponent],
  providers: [EntityStoreService],
  template: `
    <div data-testid="persons-feature">
      <persons-management-persons
        [data]="entityService.entities()"
        [isLoading]="!!entityService.isLoading()"
        [messages]="entityService.messages()"
        [noData]="entityService.noData()"
        [header]="header"
        [crud]="true"
        [todaysDateAsString]="entityService.currentDate()"
        [selectedEntity]="entityService.selectedEntity()"
        [isNewBeforeSubmitBeingEdited]="entityService.isNewEntityBeingEdited()"
        [isError]="entityService.isError()"
        (onNew)="entityService.addEntity($event)"
        (onNewBeforeSubmit)="entityService.selectUncreatedEntity()"
        (onUpdate)="entityService.updateEntity($event)"
        (onDelete)="entityService.deleteEntity($event)"
        (onEdit)="entityService.selectEntityId($event)"
        (onCancel)="entityService.resetSelectedEntity()"
      >
      </persons-management-persons>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonsSmartComponent {
  header = entityHeader;
  entityService = inject(EntityStoreService);
}
