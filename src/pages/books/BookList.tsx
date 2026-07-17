import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, AlertCircle } from 'lucide-react';
import { bookService } from '../../services/bookService';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';
import BookCard from '../../components/books/BookCard';
import type { Book } from '../../types';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hydrate } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getBooks();
      setBooks(data);
    } catch {
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
    fetchBooks();
  }, [fetchBooks]);

  const handleDeleted = (bookUid: string) => {
    setBooks((prev) => prev.filter((b) => b.book_uid !== bookUid));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading books…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <button
          onClick={fetchBooks}
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Explore Books</h1>
            {books.length > 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500">{books.length} books in the library</p>
            )}
          </div>
        </div>
        {isAuthenticated && (
          <Link
            to="/books/create_book"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add Book
          </Link>
        )}
      </div>

      {/* Empty state */}
      {books.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <BookOpen className="w-14 h-14 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No books yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Be the first to add a book to the library.</p>
          {isAuthenticated && (
            <Link
              to="/books/create_book"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              Add a Book
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.book_uid} book={book} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
