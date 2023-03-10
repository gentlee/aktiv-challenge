import actionCreatorFactory from 'typescript-fsa';
import {getImages} from '../../api/pixabay/endpoints';
import {PixabayGetImagesResponse} from '../../api/pixabay/types';
import {getState, dispatch} from '../store';

const actionCreator = actionCreatorFactory('IMAGES');

export const loadImages = actionCreator.async<
  {
    userInput: string;
    query: string;
    page: number;
  },
  PixabayGetImagesResponse,
  Error
>('LOAD_PAGE');

export const loadNextImagePage = async (userInput?: string) => {
  const {
    userInput: currentUserInput,
    query: currentQuery,
    error: currentError,
    currentPage,
    loading,
    endReached,
  } = getState();

  const query =
    userInput === undefined
      ? currentQuery
      : userInput.trim().toLowerCase().replace(/\s+/g, '+');

  if (userInput === undefined) {
    userInput = currentUserInput;
  } else if (query === currentQuery) {
    console.log('cancel request for similar query', {
      userInput,
      currentUserInput,
      query,
      currentQuery,
    });
    return;
  }

  const page =
    currentQuery !== query ? 1 : currentError ? currentPage : currentPage + 1;

  if (page !== 1 && (loading || endReached)) {
    console.log('cancel request, already loading or end reached', {
      query,
      page,
      loading,
      endReached,
    });
    return;
  }

  const actionParams = {userInput, query, page};

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
    currentState.query !== actionParams.query ||
    currentState.currentPage !== actionParams.page ||
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
