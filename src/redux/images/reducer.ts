import {reducerWithInitialState} from 'typescript-fsa-reducers';
import {PixabayImage} from '../../api/pixabay/types';
import {loadImages} from './actions';

const emptyIds = new Set<number>();
const emptyData: PixabayImage[] = [];

type ImagesState = {
  userInput: string;
  query: string;
  currentPage: number;
  loading: boolean;
  endReached: boolean;
  data: PixabayImage[];
  ids: Set<number>;
  total?: number;
  error?: Error;
};

const initialState: ImagesState = {
  userInput: '',
  query: '',
  currentPage: 0,
  loading: false,
  endReached: false,
  data: emptyData,
  ids: emptyIds,
  total: undefined,
  error: undefined,
};

export const imagesReducer = reducerWithInitialState(initialState)
  .case(loadImages.started, (state, {userInput, query, page}) => {
    const newState = {
      ...state,
      userInput,
      query,
      currentPage: page,
      loading: true,
    };
    if (page === 1) {
      newState.data = emptyData;
      newState.ids = emptyIds;
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
    const hasNewData = result.hits.some(x => !state.ids.has(x.id));
    if (hasNewData) {
      const data = [...state.data];
      const ids = new Set(state.ids);
      for (let hit of result.hits) {
        if (!ids.has(hit.id)) {
          ids.add(hit.id);
          data.push(hit);
        } else {
          console.log('duplicated item ignored', hit);
        }
      }
      newState.data = data;
      newState.ids = ids;
    } else if (result.hits.length) {
      console.warn('duplicated page ignored', result);
    }

    newState.endReached =
      result.hits.length === 0 || newState.data.length === result.totalHits;

    return newState;
  });
