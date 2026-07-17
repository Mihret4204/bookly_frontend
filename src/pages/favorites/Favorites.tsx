import { useEffect, useState, useCallback } from 'react';
import { Heart } from 'lucide-react';
import BookCard from '../../components/books/BookCard';
import { favoriteService } from '../../services/favoriteService';
import { useFavoritesStore } from '../../store/favoritesStore';
import type { Book } from '../../types';

const Favorites = () => {
  const { hydrate } = useFavoritesStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      await hydrate();
      const favBooks = await favoriteService.getFavorites();
      setBooks(favBooks);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [hydrate]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // When heart is toggled off from a card, remove it from local state too
  const handleDeleted = (bookUid: string) => {
    setBooks((prev) => prev.filter((b) => b.book_uid !== bookUid));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading favorites…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Favorites</h1>
        {books.length > 0 && (
          <span className="text-sm text-gray-400 dark:text-gray-500 font-normal">
            ({books.length} books)
          </span>
        )}
      </div>

      {books.length === 0 ? (
        <div className="text-center py-24 text-gray-400 dark:text-gray-600">
          <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-medium">No favorite books yet</p>
          <p className="text-sm mt-1">
            Browse books and hit the heart icon to save them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.book_uid}
              book={book}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
