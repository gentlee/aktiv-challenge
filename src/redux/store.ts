import {applyMiddleware, legacy_createStore} from 'redux';
import logger from 'redux-logger';
import {imagesReducer} from './images/reducer';

export type ReduxState = ReturnType<typeof getState>;

export const store = legacy_createStore(
  imagesReducer,
  __DEV__ ? applyMiddleware(logger) : undefined,
);

// "no redux-thunk" pattern
export const dispatch = store.dispatch;
export const getState = store.getState;
