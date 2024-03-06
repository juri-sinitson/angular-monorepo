import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { signalStore, withState, withMethods,  patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { mergeMap, pipe, tap } from 'rxjs';

import { LoggerUrls } from '../../urls/logger';
import { withDevToolsFunc } from '../../util/store.util';
import { ExtendedError } from '../../util/extended-error.util';

type LoggerState = {
  logger: {
    type: 'error',
    /**
     * Additional data to be logged, e.g. the user id, role, etc.
     * to have more chance to reproduce the error.
     */
    metaData: object; 
    isPostingToBackend: boolean;
    payload: ExtendedError | null;
    success: boolean | null;
  }
}

const initialState: LoggerState = {  
  logger: {
    type: 'error',
    metaData: {},
    isPostingToBackend: false,
    payload: null,
    success: null,
  }
};

const loggerUrls = new LoggerUrls();


const loggerStore = signalStore(
  { providedIn: 'root' },
  withDevToolsFunc(''),
  withState(initialState),
  withMethods((store) => ({
    // TODO: use the redux pattern instead when it's 
    // officially supported by the signal store of ngrx.
    triggerSideEffect: rxMethod<ExtendedError>(
      pipe(
        tap((error: ExtendedError): void => patchState(store, (state) => (
          { logger: {...state.logger, payload: error}}))),
        mergeMap((error: ExtendedError) => {          
          console.error(error);
          console.log('Logging the error to the server.');
          const httpClient = inject(HttpClient);
          return httpClient.post(loggerUrls.logUrl, error).pipe(
            tapResponse({
              next: () =>  {
                console.error('Succeeded logging the error to the server.');
                patchState(store, (state) => ({ logger: {...state.logger, 
                  isPostingToBackend: false, success: true}}))
              },
              error: (error) => { 
                console.error('Failed logging the error to the server.');
                console.error(error);
                patchState(store, (state) => ({logger: {...state.logger, 
                  isPostingToBackend: false, success : false}}));
              },
              finalize: () => patchState(store, (state) => 
                ({logger: {...state.logger, isPostingToBackend: false}})),
            })
          );
        }),
      )
    ),
  }
)),);


@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  error(error: ExtendedError): void {
    const store = inject(loggerStore);
    store.triggerSideEffect(error);
  }
}
