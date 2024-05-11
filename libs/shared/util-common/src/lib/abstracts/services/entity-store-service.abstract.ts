import { computed, inject, ProviderToken, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { signalStore, withHooks, withMethods, patchState, withState, StateSignal, signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { addEntity, EntityId, EntityState, removeEntity, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { exhaustMap, pipe, tap } from 'rxjs';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from "../../interfaces/message.interface";
import { withDevToolsFunc } from "../../util/store.util";

type Entity = { id: EntityId; };

type BasicState = { 
  isLoading: boolean | null; 
  error: Error | null;
  selectedEntityId: EntityId | null | undefined;
};

type State<T> = BasicState & EntityState<T>;

interface BasicEntityStore<T> extends StateSignal<State<T>>{
  entities: Signal<T[]>;
  isLoading: Signal<boolean|null>;  
  error: Signal<Error | null>;
  selectedEntityId: Signal<EntityId | null | undefined>;
  selectedEntity: Signal<T|null>;
  loadWithSideEffects: () => void;
  addWithSideEffects: (entity: Entity) => void;
  updateWithSideEffects: (entity: Entity) => void;
  deleteWithSideEffects: (id: EntityId) => void;
}

type Provider<T> = ProviderToken<BasicEntityStore<T>>;

type SelectedEntityState = { selectedEntityId: EntityId | null | undefined };

const withSelectedEntity = <Entity>() => {
  return signalStoreFeature(
    { state: type<EntityState<Entity>>() },
    withState<SelectedEntityState>({ selectedEntityId: undefined }),
    withComputed(({ entityMap, selectedEntityId }) => ({
      selectedEntity: computed(() => {
        const selectedId = selectedEntityId();
        return selectedId ? entityMap()[selectedId] : null;
      }),
    }))
  );
};

const createStore = <T  extends Entity>(url: string, devToolsScope: string): unknown => {

  const initialState: State<T> = {
    isLoading: null,
    error: null,
    entityMap: {},
    ids: [],
    selectedEntityId: undefined,
  };
  
  return signalStore(
    { providedIn: 'root' },
    withDevToolsFunc(devToolsScope),
    withEntities<T>(),
    withState(initialState),
    withSelectedEntity<T>(),
    withMethods((store, httpClient = inject(HttpClient)) =>  {

      const resetOnSuccess = () => {
        patchState(store, { selectedEntityId: undefined, error: null });
      };

      return {

        loadWithSideEffects: rxMethod<T[]>(
          pipe(
            tap(() => patchState(store, {isLoading: true, error: null})),        
            exhaustMap(() => {
              
              return httpClient.get<T[]>(url).pipe(
                tapResponse({
                  next: (products: T[]) => {                 
                    patchState(store, setAllEntities(products));
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
                  next: (entityFromBackend: T) => {
                    resetOnSuccess();
                    patchState(store, addEntity(entityFromBackend));
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
              next: ( entity: T) => {
                resetOnSuccess();            
                patchState(store, updateEntity({id: entity.id, changes: entity}));
              },
              error: (error: Error) => patchState(store, { error }),
              finalize: () => patchState(store, {isLoading: false })              
            }))
          ),        
        )),
        
        deleteWithSideEffects: rxMethod<EntityId>(pipe(
          tap(() => patchState(store, {isLoading: true, error: null})),
          exhaustMap((id: EntityId) => httpClient.delete<void>(`${url}/${id}`).pipe(
            tapResponse({
              next: () => {
                resetOnSuccess();            
                patchState(store, removeEntity(id));
              },
              error: (error: Error) => patchState(store, { error }),
              finalize: () => patchState(store, {isLoading: false })              
            }))
          ),
        )),
  
      }
    }
    ),
    withHooks({ onInit: (store) => store.loadWithSideEffects([]) })
  );
}

export abstract class AbstractEntityStoreService<T  extends Entity> {
  
  private store!: BasicEntityStore<T>;

  // We assume the item of correct type is coming here.
  // If not the probability is very to detect it in 
  // the E2E tests.
  addEntity(entity: Entity): void {
    this.store.addWithSideEffects(entity);
  }

  // We assume the item of correct type is coming here.
  // If not the probability is very to detect it in 
  // the E2E tests.
  updateEntity(entity: Entity): void {    
    this.store.updateWithSideEffects(entity);
  }

  deleteEntity(id: EntityId): void {
    this.store.deleteWithSideEffects(id);
  }
  
  selectEntityId(id: EntityId): void {
    patchState(this.store, { selectedEntityId: id });
  }

  resetSelectedEntity(): void {    
    patchState(this.store, { selectedEntityId: undefined, });
  }

  selectUncreatedEntity(): void {
    patchState(this.store, { selectedEntityId: null });
  }

  get isNewEntityBeingEdited(): Signal<boolean> {
    return computed(() => this.store.selectedEntityId() === null);
  }

  get selectedEntity(): Signal<T | null> {
    return this.store.selectedEntity;
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
