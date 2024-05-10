import { computed, inject, ProviderToken, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { signalStore, withHooks, withMethods, patchState, withState, StateSignal } from '@ngrx/signals';
import { addEntity, EntityId, EntityState, removeEntity, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { exhaustMap, pipe, tap } from 'rxjs';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from "../../interfaces/message.interface";
import { withDevToolsFunc } from "../../util/store.util";

type Entity = { id: EntityId; };

type BasicState = { isLoading: boolean | null; error: Error | null; };

type State<T> = BasicState & EntityState<T>;

interface BasicEntityStore<T> extends StateSignal<State<T>>{
  entities: Signal<T[]>;
  isLoading: Signal<boolean|null>;
  error: Signal<Error | null>;
  loadWithSideEffects: () => void;
  addWithSideEffects: (entity: T) => void;
  updateWithSideEffects: (entity: T) => void;
  deleteWithSideEffects: (id: EntityId) => void;
}

type Provider<T> = ProviderToken<BasicEntityStore<T>>;

const createStore = <T  extends Entity>(url: string, devToolsScope: string): unknown => {

  const initialState: State<T> = {
    isLoading: null,
    error: null,
    entityMap: {},
    ids: []
  };
  
  return signalStore(
    { providedIn: 'root' },
    withDevToolsFunc(devToolsScope),
    withEntities<T>(),
    withState(initialState),
    withMethods((store, httpClient = inject(HttpClient)) => ({

      loadWithSideEffects: rxMethod<T[]>(
        pipe(
          tap(() => patchState(store, {isLoading: true, error: null})),        
          exhaustMap(() => {
            
            return httpClient.get<T[]>(url).pipe(
              tapResponse({
                next: (products: T[]) => {
                  return patchState(store, setAllEntities(products));
                },
                error: (error: Error) => patchState(store, { error }),
                finalize: () => patchState(store, {isLoading: false })              
              }))
          }
          ),
      )),
      
      addWithSideEffects: rxMethod<T>(
        pipe(
          tap(() => patchState(store, {isLoading: true, error: null})),
          exhaustMap((entity: T) => {
            return httpClient.post<T>(url, entity).pipe(
              tapResponse({
                next: () => {
                  return patchState(store, addEntity(entity));
                },
                error: (error: Error) => patchState(store, { error }),
                finalize: () => patchState(store, {isLoading: false })              
              }))
           }
          ),
      ),),

      updateWithSideEffects: rxMethod<T>(pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        exhaustMap((entity: T) => httpClient.put<T>(`${url}/${entity.id}`, entity).pipe(
          tapResponse({
            next: (entity: T) => patchState(store, updateEntity({id: entity.id, changes: entity})),
            error: (error: Error) => patchState(store, { error }),
            finalize: () => patchState(store, {isLoading: false })              
          }))
        ),        
      )),
      
      deleteWithSideEffects: rxMethod<EntityId>(pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        exhaustMap((id: EntityId) => httpClient.delete<void>(`${url}/${id}`).pipe(
          tapResponse({
            next: () => patchState(store, removeEntity(id)),
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
  
  addEntity(entity: T): void {
    this.store.addWithSideEffects(entity);
  }

  updateEntity(entity: T): void {    
    this.store.updateWithSideEffects(entity);
  }

  deleteEntity(id: EntityId): void {
    this.store.deleteWithSideEffects(id);
  }
  
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
      const error =  this.store.error();  
      if (error) {        
        return [{
          severity: 'error',
          summary: 'Network error',
          detail: error.message 
        }];
      }
      return [];
    })
  }

  get isError(): Signal<boolean> {
    return computed(() => !!this.store.error());
  }

  constructor() {
    const store = createStore<T>(this.getGetUrl(), this.getDevToolsScope());
    this.store = inject(store as Provider<T>);
  }
    
  protected abstract getDevToolsScope(): string;
  protected abstract getGetUrl(): string;
}
