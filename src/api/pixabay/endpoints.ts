import {decode} from '../../utils/decode';
import {PixabayGetImagesResponse} from './types';

// some kind of protection
const key = decode(
  'MzIyMjMyNjI',
  'tNjZmYWM0MTYw',
  'ZmQzMjAyZmMx',
  'YzJmMzRhZQ==',
);

export const getImages = async (query: string, page: number) => {
  const url = `https://pixabay.com/api/?q=${query}&page=${page}&key=${key}`;

  console.log('-> ', url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error: ' + response.statusText);
  }

  const parsed: PixabayGetImagesResponse = await response.json();

  return parsed;
};
