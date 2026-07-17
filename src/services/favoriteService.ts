import api from './api';
import type { Book } from '../types';

// Backend /favorites/ returns { favorites: [ { uid, title, ... } ] }
const normalizeFavBook = (f: any): Book => ({
  book_uid: f.book_uid ?? f.uid ?? '',
  title: f.title,
  author: f.author,
  publisher: f.publisher,
  published_date: f.published_date,
  page_count: f.page_count,
  language: f.language,
  cover_url: f.cover_url ?? f.cover_image_path ?? undefined,
  cover_image_path: f.cover_image_path,
  user_uid: f.user_uid,
  created_at: f.created_at,
  updated_at: f.updated_at,
});

export const favoriteService = {
  getFavorites: async (): Promise<Book[]> => {
    const { data } = await api.get('/favorites/');
    return (data?.favorites ?? []).map(normalizeFavBook);
  },

  addFavorite: async (bookUid: string): Promise<void> => {
    await api.post(`/favorites/${bookUid}`);
  },

  removeFavorite: async (bookUid: string): Promise<void> => {
    await api.delete(`/favorites/${bookUid}`);
  },
};
