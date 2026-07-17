import type { Book, User } from '../types';

const normalizeId = (value: unknown): string | null => {
  if (value == null) return null;
  const text = String(value).trim();
  return text ? text.toLowerCase() : null;
};

export const getUserId = (user: User | null | undefined): string | null => {
  if (!user) return null;
  return normalizeId(user.user_uid ?? user.uid ?? null);
};

export const getBookOwnerId = (book: Pick<Book, 'creator' | 'user_uid'> | null | undefined): string | null => {
  if (!book) return null;
  return normalizeId(book.creator?.uid ?? book.user_uid ?? null);
};

export const isBookOwner = (
  user: User | null | undefined,
  book: Pick<Book, 'creator' | 'user_uid'> | null | undefined,
): boolean => {
  const currentUserId = getUserId(user);
  const ownerId = getBookOwnerId(book);

  return Boolean(currentUserId && ownerId && currentUserId === ownerId);
};
