import { Injectable } from '@angular/core';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AbstractEntityStoreService } from '@angular-monorepo/shared/util-common';

// -- STEP 1: ADJUST THE URL! --
import { getAllPersonsUrl } from './urls';
// -- STEP 2: ADJUST THE INTERFACE PATH! --
import { PersonInterface } from '../interfaces/person.interface';

@Injectable({
  providedIn: 'root',
})
export class PersonEntityStoreService extends AbstractEntityStoreService<PersonInterface> {
  protected override getDevToolsScope(): string {
    return 'Persons';
  }

  protected override getGetUrl(): string {
    return getAllPersonsUrl;
  }
}
