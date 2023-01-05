import {reducerWithInitialState} from 'typescript-fsa-reducers';
import {PixabayImage} from '../../api/pixabay/types';
import {loadImages} from './actions';

type ImagesState = {
  _mutableIds: Set<number>;
  userInput: string;
  currentPage: number;
  loading: boolean;
  endReached: boolean;
  data: PixabayImage[];
  total?: number;
  error?: Error;
};

const initialState: ImagesState = {
  _mutableIds: new Set(),
  userInput: '',
  currentPage: 0,
  loading: false,
  endReached: false,
  data: [],
  total: undefined,
  error: undefined,
};

export const imagesReducer = reducerWithInitialState(initialState)
  .case(loadImages.started, (state, {userInput, page}) => {
    const newState = {
      ...state,
      userInput,
      currentPage: page,
      loading: true,
    };
    if (page === 1) {
      newState._mutableIds.clear();
      newState.data = [];
      newState.error = undefined;
      newState.endReached = false;
      newState.total = undefined;
    }
    return newState;
  })
  .case(loadImages.failed, (state, {error}) => {
    return {
      ...state,
      loading: false,
      error,
    };
  })
  .case(loadImages.done, (state, {result}) => {
    const newState = {
      ...state,
      loading: false,
      total: result.totalHits,
      error: undefined,
    };

    // remove duplicates, which are possible with offset-based pagination
    const ids = state._mutableIds;
    const hasNewData = result.hits.some(x => !ids.has(x.id));
    if (hasNewData) {
      const data = [...state.data];
      for (let hit of result.hits) {
        if (!ids.has(hit.id)) {
          ids.add(hit.id);
          data.push(hit);
        } else {
          console.log('duplicated item ignored', hit);
        }
      }
      newState.data = data;
    } else if (result.hits.length) {
      console.warn('duplicated page ignored', result);
    }

    newState.endReached =
      result.hits.length === 0 || newState.data.length === result.totalHits;

    return newState;
  });
