import { Injectable, Signal, computed } from '@angular/core';
import { patchState } from '@ngrx/signals';

import {
  AbstractEntityStoreService,
  AdditionalStoreHooks,
  DateAsString,
  dateToString,
} from '@angular-monorepo/shared/util-common';
import { PersonInterface as EntityInterface } 
  from '@angular-monorepo/persons-management/domain';

import { personsUrl as entitiesUrl } from './urls';

type MoreData = {
  currentDate: DateAsString;
};

@Injectable({
  providedIn: 'root',
})
export class PersonEntityStoreService extends AbstractEntityStoreService<EntityInterface> {
  protected override getDevToolsScope(): string {
    return 'Persons';
  }

  protected override getEntitiesUrl(): string {
    return entitiesUrl;
  }

  protected override getAdditionalHooks(): AdditionalStoreHooks {
    return {
      sideEffectsOnInit: (store): void => {
        patchState(store, {
          moreData: { currentDate: dateToString(new Date()) } as MoreData,
        });
      },
    };
  }

  get currentDate(): Signal<DateAsString> {
    return computed(() => this.store.moreData().currentDate);
  }
}
