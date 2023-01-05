import actionCreatorFactory from 'typescript-fsa';
import {getImages} from '../../api/pixabay/endpoints';
import {PixabayGetImagesResponse} from '../../api/pixabay/types';
import {getQuery} from '../../utils/images';
import {getState, dispatch} from '../store';

const actionCreator = actionCreatorFactory('IMAGES');

export const loadImages = actionCreator.async<
  {
    userInput: string;
    page: number;
  },
  PixabayGetImagesResponse,
  Error
>('LOAD_PAGE');

export const loadNextImagePage = async (userInput?: string) => {
  const {
    userInput: currentUserInput,
    error: currentError,
    currentPage,
    loading,
    endReached,
  } = getState();

  const currentQuery = getQuery(currentUserInput);

  let query: string;
  if (userInput === undefined) {
    userInput = currentUserInput;
    query = currentQuery;
  } else {
    query = getQuery(userInput);

    if (query === currentQuery) {
      console.log('cancel request for similar query', {
        userInput,
        currentUserInput,
        query,
        currentQuery,
      });
      return;
    }
  }

  const page =
    currentQuery !== query ? 1 : currentError ? currentPage : currentPage + 1;

  if (page !== 1 && (loading || endReached)) {
    console.log('cancel request, already loading or end reached', {
      query,
      page,
    });
    return;
  }

  const actionParams = {userInput, page};

  dispatch(loadImages.started(actionParams));

  let response: PixabayGetImagesResponse | undefined;
  let error: Error | undefined;
  try {
    response = await getImages(query, page);
  } catch (e) {
    error = e as Error;
  }

  const currentState = getState();
  if (
    getQuery(currentState.userInput) !== query ||
    currentState.currentPage !== page ||
    !currentState.loading
  ) {
    console.log('cancel response', {
      query,
      page,
      error,
      response,
    });
    return;
  }

  if (response) {
    dispatch(loadImages.done({result: response, params: actionParams}));
  } else {
    dispatch(loadImages.failed({error: error!, params: actionParams}));
  }
};
