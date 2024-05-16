import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
// -- STEP 1: adjust the entity service path
import { PersonEntityStoreService as EntityStoreService } from '@angular-monorepo/shared-business/examples';
import { PersonsComponent as EntityComponent } from './persons.component';

const entityHeader = 'Persons';

@Component({
  selector: 'angular-monorepo-persons-smart',
  standalone: true,
  imports: [EntityComponent],
  providers: [EntityStoreService],
  template: `
    <div data-testid="persons-feature">
      <angular-monorepo-persons
        [data]="entityService.entities()"
        [isLoading]="!!entityService.isLoading()"
        [messages]="entityService.messages()"
        [noData]="entityService.noData()"
        [header]="header"
        [crud]="true"
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
      </angular-monorepo-persons>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonsSmartComponent {
  header = entityHeader;
  entityService = inject(EntityStoreService);
}
