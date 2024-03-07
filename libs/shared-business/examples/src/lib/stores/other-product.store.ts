import { computed, inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { signalStore, withHooks, withMethods, patchState, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { exhaustMap, pipe, tap } from 'rxjs';

import { ProductInterface } from '../interfaces/product.interface';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { withDevToolsFunc } from '@angular-monorepo/shared/util-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from '@angular-monorepo/shared/util-common';

import { getAllOtherProductsUrl }  from './urls';

// TODO: Share this type
type OtherProductsState = { isLoading: boolean | null; error: Error | null; };

const initialState: OtherProductsState = {
  isLoading: null,
  error: null,
};

const otherProductStore = signalStore(
  { providedIn: 'root' },
  withDevToolsFunc('Other Product'),
  withEntities<ProductInterface>(),
  withState(initialState),
  withMethods((store) => ({
    loadWithSideEffects: rxMethod<ProductInterface[]>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),        
        exhaustMap(() => inject(HttpClient).get<ProductInterface[]>(getAllOtherProductsUrl).pipe(
          tapResponse({
            next: (products: ProductInterface[]) => patchState(store, 
              setAllEntities(products)),
            error: (error: Error) => patchState(store, { error }),
            finalize: () => patchState(store, {isLoading: false })              
          }))
        ),
    )),
    
  })),
  withHooks({ onInit: (store) => store.loadWithSideEffects([]) })
);


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
export class OtherProductService {

  private store = inject(otherProductStore);

  get products(): Signal<ProductInterface[]> {
    return this.store.entities;
  }

  get isLoading(): Signal<boolean> {
    return computed(() => !!this.store.isLoading());
  }

  get noData(): Signal<boolean> {
    return computed(() => this.store.isLoading() === false 
      && this.store.entities().length === 0
      && this.store.error() === null
    );
  }

  get messages(): Signal<MessageInterface[]> {
    // TODO!
    // Add a standard error routine here to avoid
    // copy-pasting the same error handling code.
    return computed(() => {
      if (this.store.error()) {
        return [{
          severity: 'error',
          summary: 'Error loading products',
          detail: this.store.error()?.message 
            // ?? 'Unknown error' // Can't provoke 'Unknown error' with
            // the current (2024-03-12) http testing API of Angular.
            // So commenting out to avoid dead code.
        }];
      }
      return [];
    })
  }
}
