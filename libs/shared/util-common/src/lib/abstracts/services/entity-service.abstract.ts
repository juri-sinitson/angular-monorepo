import { computed, inject, ProviderToken, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { signalStore, withHooks, withMethods, patchState, withState } from '@ngrx/signals';
import { EntityId, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { exhaustMap, pipe, tap } from 'rxjs';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from "../../interfaces/message.interface";
import { withDevToolsFunc } from "../../util/store.util";

type State = { isLoading: boolean | null; error: Error | null; };

interface BasicEntityStore<T> {
  entities: Signal<T[]>;
  isLoading: Signal<boolean|null>;
  error: Signal<Error | null>;
}

type Provider<T> = ProviderToken<BasicEntityStore<T>>;

const initialState: State = {
  isLoading: null,
  error: null,
};

type Entity = { id: EntityId; };

export const createStore = <T  extends Entity>(url: string, devToolsScope: string): unknown => {
  return signalStore(
    { providedIn: 'root' },
    withDevToolsFunc(devToolsScope),
    withEntities<T>(),
    withState(initialState),
    withMethods((store) => ({
      loadWithSideEffects: rxMethod<T[]>(
        pipe(
          tap(() => patchState(store, {isLoading: true, error: null})),        
          exhaustMap(() => inject(HttpClient).get<T[]>(url).pipe(
            tapResponse({
              next: (products: T[]) => patchState(store, 
                setAllEntities(products)),
              error: (error: Error) => patchState(store, { error }),
              finalize: () => patchState(store, {isLoading: false })              
            }))
          ),
      )),
      
    })),
    withHooks({ onInit: (store) => store.loadWithSideEffects([]) })
  );
}

export abstract class AbstractEntityStoreService<T  extends Entity> {
  
  protected store!: BasicEntityStore<T>;

  get entities(): Signal<T[]> {
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
    // Add a standard error routine
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

  constructor() {
    const store = createStore<T>(this.getGetUrl(), this.getDevToolsScope());
    this.store = inject(store as Provider<T>);
  }
  
  // protected abstract initStore(): void;
  protected abstract getDevToolsScope(): string;
  protected abstract getGetUrl(): string;
}