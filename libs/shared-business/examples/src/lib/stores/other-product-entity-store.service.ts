import { Injectable } from '@angular/core';

import { ProductInterface } from '../interfaces/product.interface';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AbstractEntityStoreService } from '@angular-monorepo/shared/util-common';
import { otherProductsUrl }  from './urls';

/**
 * Created on the fast track for E2E testing demo purposes.
 * One of the goals is to demonstrate E2E testing 
 * of a page with multiple API calls.
 * 
 * TODO: Try to DRY this service e.g. by inheritance.
 */
@Injectable({
  providedIn: 'root'
})
export class OtherProductEntityStoreService extends AbstractEntityStoreService<ProductInterface> {

  protected override getDevToolsScope(): string {
    return 'Other Product';
  }

  protected override getEntitiesUrl(): string {
    return otherProductsUrl;
  }
}
