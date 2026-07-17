import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Sparkles, Shield, Bookmark, Star } from 'lucide-react';
import BookCard from '../../components/books/BookCard';
import { bookService } from '../../services/bookService';
import { useFavoritesStore } from '../../store/favoritesStore';
import type { Book } from '../../types';

const Home = () => {
  const { hydrate } = useFavoritesStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
    bookService
      .getBooks()
      .then(setBooks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleted = (bookUid: string) =>
    setBooks((prev) => prev.filter((b) => b.book_uid !== bookUid));

  const trending = books.slice(0, 4);
  const featured = books.slice(4, 10);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-4 border-r-transparent" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Loading your library…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-4">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 lg:p-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Community Driven Platform
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Discover Your Next <br />
              <span className="text-indigo-600 dark:text-indigo-400">Great Read</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
              Share detailed reviews, curate your personal collection, and connect deeply through stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/books"
                className="inline-flex justify-center items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-indigo-600/10"
              >
                Browse All Books
              </Link>
              <Link
                to="/books/create_book"
                className="inline-flex justify-center items-center px-6 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 transition"
              >
                Add to Shelf
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block h-80 xl:h-96 w-full rounded-2xl overflow-hidden shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80"
              alt="Bookshelf"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Star, color: 'orange', title: 'Community Reviews', desc: 'See what fellow bookworms are writing before your next story.' },
          { icon: Bookmark, color: 'indigo', title: 'Personal Shelf', desc: 'Build and curate your own catalog. Track books you read or plan to read.' },
          { icon: Shield, color: 'emerald', title: 'Clean & Open', desc: 'An elegant interface designed by readers, for readers. No bloatware.' },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
            <div className={`p-3 bg-${color}-50 dark:bg-${color}-950/30 text-${color}-600 dark:text-${color}-400 rounded-xl`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-950/40 rounded-xl">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending This Week</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trending.map((book) => (
              <BookCard key={book.book_uid} book={book} onDeleted={handleDeleted} />
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Discover Books</h2>
            </div>
            <Link to="/books" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((book) => (
              <BookCard key={book.book_uid} book={book} onDeleted={handleDeleted} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {books.length === 0 && (
        <div className="text-center py-20 px-4 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-gray-300 dark:text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Your bookshelf is empty</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
            Be the pioneer! Start building the community index by adding your favorite books.
          </p>
          <Link
            to="/books/create_book"
            className="inline-flex justify-center items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-md"
          >
            Add a Book
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
