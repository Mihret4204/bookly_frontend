import api from './api';
import type { Book, BookDetail, BookCreateData, BookUpdateData } from '../types';

// Backend returns `uid` as the primary key; we normalise to `book_uid` everywhere.
const normalize = (raw: any): Book => ({
  ...raw,
  book_uid: raw.book_uid ?? raw.uid ?? '',
  cover_url: raw.cover_url ?? raw.cover_image_path ?? undefined,
});

const normalizeDetail = (raw: any): BookDetail => ({
  ...normalize(raw),
  reviews: raw.reviews ?? [],
});

export const bookService = {
  getBooks: async (): Promise<Book[]> => {
    const { data } = await api.get('/books/');
    return (data ?? []).map(normalize);
  },

  getUserBooks: async (userUid: string): Promise<Book[]> => {
    const { data } = await api.get(`/books/user/${userUid}/`);
    return (data ?? []).map(normalize);
  },

  getBookById: async (bookUid: string): Promise<BookDetail> => {
    const { data } = await api.get(`/books/${bookUid}/`);
    return normalizeDetail(data);
  },

  createBook: async (payload: BookCreateData): Promise<Book> => {
    const { data } = await api.post('/books/create_book', payload);
    return normalize(data);
  },

  updateBook: async (bookUid: string, payload: BookUpdateData): Promise<Book> => {
    const { data } = await api.patch(`/books/update_book/${bookUid}/`, payload);
    return normalize(data);
  },

  deleteBook: async (bookUid: string): Promise<void> => {
    await api.delete(`/books/delete_book/${bookUid}`);
  },

  uploadCover: async (bookUid: string, file: File): Promise<Book> => {
    const form = new FormData();
    form.append('cover', file);
    // Do NOT manually set Content-Type — axios must auto-set it so the
    // multipart boundary is included (e.g. multipart/form-data; boundary=----xyz)
    const { data } = await api.post(`/books/${bookUid}/cover`, form);
    return normalize(data);
  },

  removeCover: async (bookUid: string): Promise<void> => {
    await api.delete(`/books/${bookUid}/cover`);
  },
};
