import { Link } from 'react-router-dom';
import { Heart, BookOpen } from 'lucide-react';
import type { Book } from '../../types';
import { useFavoritesStore } from '../../store/favoritesStore';

interface BookCardProps {
  book: Book;
  onDeleted?: (bookUid: string) => void;
}

const BookCard = ({ book }: BookCardProps) => {
  const { isFavorited, toggle } = useFavoritesStore();

  const favorited = isFavorited(book.book_uid);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggle(book.book_uid);
  };

  const coverSrc = book.cover_url || 'https://placehold.co/300x440/e2e8f0/94a3b8?text=No+Cover';

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow flex flex-col">
        {/* Cover */}
        <div className="relative">
          <Link to={`/books/${book.book_uid}`}>
            <img
              src={coverSrc}
              alt={book.title}
              className="w-full h-52 object-cover"
            />
          </Link>
          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 shadow transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favorited ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500'
              }`}
            />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <div className="flex-1 min-w-0">
            <h2
              className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1"
              title={book.title}
            >
              {book.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {book.author}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {book.creator?.username
                ? `Added by ${book.creator.username}`
                : book.user_uid
                  ? 'Added by a member'
                  : 'Public library'}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
              {book.language && <span>{book.language.toUpperCase()}</span>}
              {book.language && book.page_count && <span>·</span>}
              {book.page_count && <span>{book.page_count} pages</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1.5 pt-1">
            <Link
              to={`/books/${book.book_uid}`}
              className="flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              View Details
            </Link>
          </div>
        </div>
      </div>

    </>
  );
};

export default BookCard;
