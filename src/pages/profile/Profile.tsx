import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Heart, BadgeCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import type { User, Book } from '../../types';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    authService
      .getCurrentUser()
      .then((u) => { if (mounted) setUser(u); })
      .catch((error) => {
        if (mounted) {
          toast.error(error?.message || 'Unable to load your profile right now.');
          setUser(null);
        }
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const books: Book[] = user?.books ?? [];
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : '—';

  const initials = user?.first_name?.[0] ?? user?.username?.[0] ?? '?';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-transparent dark:border-gray-800 p-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.username}
                className="w-36 h-36 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-md"
              />
            ) : (
              <div className="w-36 h-36 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-6xl text-white font-bold shadow-md select-none">
                {initials.toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {user?.first_name
                  ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
                  : user?.username ?? 'Unknown'}
              </h1>
              {user?.is_verified && (
                <BadgeCheck className="w-6 h-6 text-indigo-500 flex-shrink-0" aria-label="Verified" />
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">@{user?.username}</p>

            {user?.role && (
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
                {user.role}
              </span>
            )}

            <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Joined {joinedDate}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                {books.length} {books.length === 1 ? 'book' : 'books'} added
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gray-400" />
                {user?._favorites_count ?? 0} favorites
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books added */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-transparent dark:border-gray-800 p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-5">Books Added</h2>

        {books.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-600">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No books added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {books.map((book) => (
              <button
                key={book.book_uid}
                type="button"
                onClick={() => navigate(`/books/${book.book_uid}`)}
                className="flex items-center gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left w-full"
              >
                <img
                  src={
                    book.cover_url
                    || `https://placehold.co/80x112/e2e8f0/94a3b8?text=${encodeURIComponent(book.title[0])}`
                  }
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{book.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">By {book.author}</p>
                  {book.created_at && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Added {new Date(book.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
