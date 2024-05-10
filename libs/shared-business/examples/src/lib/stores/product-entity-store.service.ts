import { Injectable } from '@angular/core';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AbstractEntityStoreService } from '@angular-monorepo/shared/util-common';

import { productsUrl }  from './urls';
import { ProductInterface } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductEntityStoreService extends AbstractEntityStoreService<ProductInterface> {
  
  protected override getDevToolsScope(): string {
    return 'Product';
  }

  protected override getGetUrl(): string {
    return productsUrl;
  }
}
