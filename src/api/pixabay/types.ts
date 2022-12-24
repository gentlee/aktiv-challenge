export type PixabayGetImagesResponse = {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
};

export type PixabayImage = {
  id: number;
  pageURL: string;
  type: 'all' | 'photo' | 'illustration' | 'vector';
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
  imageWidth: number;
  imageHeight: number;
};
