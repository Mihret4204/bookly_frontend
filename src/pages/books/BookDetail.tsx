import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Calendar, Globe, Hash, Heart, Pencil, Trash2,
  Upload, X, ChevronLeft, Star, Send, User,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';
import ReviewCard from '../../components/reviews/ReviewCard';
import { bookService } from '../../services/bookService';
import { reviewService } from '../../services/reviewService';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';
import type { BookDetail as BookDetailType } from '../../types';
import { isBookOwner } from '../../utils/ownership';

const BookDetail = () => {
  const { book_uid } = useParams<{ book_uid: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toggle, isFavorited, hydrate } = useFavoritesStore();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [book, setBook] = useState<BookDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [removingCover, setRemovingCover] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const favorited = book ? isFavorited(book.book_uid) : false;
  const canEdit = isBookOwner(user, book);
  const load = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const data = await bookService.getBookById(uid);
      setBook(data);
    } catch (error: any) {
      const message = error?.message || 'Book not found';
      toast.error(message);
      if (error?.response?.status === 401) {
        navigate('/login', { replace: true });
      } else {
        navigate('/books');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    hydrate();
    if (book_uid) load(book_uid);
  }, [book_uid, load]);

  // ── Favorite ──────────────────────────────────────────────────────────────
  const handleFavoriteToggle = () => {
    if (book) toggle(book.book_uid);
  };

  // ── Cover ─────────────────────────────────────────────────────────────────
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleCoverUpload = async () => {
    if (!book || !coverFile) return;
    setUploadingCover(true);
    try {
      const updated = await bookService.uploadCover(book.book_uid, coverFile);
      setBook((prev) => prev ? { ...prev, cover_url: updated.cover_url } : prev);
      setCoverPreview(null);
      setCoverFile(null);
      toast.success('Cover uploaded');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to upload cover');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCoverRemove = async () => {
    if (!book) return;
    setRemovingCover(true);
    try {
      await bookService.removeCover(book.book_uid);
      setBook((prev) => prev ? { ...prev, cover_url: undefined } : prev);
      toast.success('Cover removed');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to remove cover');
    } finally {
      setRemovingCover(false);
    }
  };

  const cancelCoverPreview = () => {
    setCoverPreview(null);
    setCoverFile(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // ── Delete book ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!book) return;
    setDeleting(true);
    try {
      await bookService.deleteBook(book.book_uid);
      toast.success('Book deleted');
      navigate('/books');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete book');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // ── Review submit ─────────────────────────────────────────────────────────
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    if (!newReview.comment.trim()) {
      toast.error('Please write a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.addReview(book.book_uid, {
        rating: newReview.rating,
        review_text: newReview.comment.trim(),
      });
      toast.success('Review posted');
      await load(book.book_uid);
      setNewReview({ rating: 5, comment: '' });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // ── Review deleted callback ───────────────────────────────────────────────
  const handleReviewDeleted = (reviewUid: string) => {
    setBook((prev) =>
      prev ? { ...prev, reviews: prev.reviews.filter((r) => r.uid !== reviewUid) } : prev
    );
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading book…</p>
      </div>
    );
  }

  if (!book) return null;

  const displayCover = coverPreview ?? book.cover_url;

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        to="/books"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Books
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ── Left: Cover + actions ─────────────────────────────────────── */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            {/* Cover */}
            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 dark:border-gray-700">
              {displayCover ? (
                <img src={displayCover} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/30">
                  <BookOpen className="w-20 h-20 text-indigo-300" />
                </div>
              )}
              {coverPreview && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Preview
                </div>
              )}
            </div>

            {/* Cover controls */}
            {canEdit && (
              <div className="space-y-2">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverSelect}
                />
                {coverPreview ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCoverUpload}
                      disabled={uploadingCover}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingCover ? 'Uploading…' : 'Upload Cover'}
                    </button>
                    <button
                      onClick={cancelCoverPreview}
                      className="px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      aria-label="Cancel"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition"
                  >
                    <Upload className="w-4 h-4" />
                    {book.cover_url ? 'Replace Cover' : 'Upload Cover'}
                  </button>
                )}
                {book.cover_url && !coverPreview && (
                  <button
                    onClick={handleCoverRemove}
                    disabled={removingCover}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-60"
                  >
                    <X className="w-4 h-4" />
                    {removingCover ? 'Removing…' : 'Remove Cover'}
                  </button>
                )}
              </div>
            )}

            {/* Favorite */}
            <button
              onClick={handleFavoriteToggle}
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900 transition"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  favorited ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </span>
            </button>

            {/* Edit / Delete */}
            {canEdit && (
              <div className="flex gap-2">
                <Link
                  to={`/books/${book.book_uid}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-sm font-semibold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-950/60 transition"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Info + Reviews ─────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-10">
          {/* Book info */}
          <div>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100">{book.title}</h1>
            <p className="text-xl text-gray-500 dark:text-gray-300 mt-2">by {book.author}</p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              Added by: {book.creator?.username ?? 'Public'}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-5">
              {book.published_date && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {book.published_date}
                </div>
              )}
              {book.language && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                  <Globe className="w-4 h-4" />
                  {book.language}
                </div>
              )}
              {book.page_count && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                  <Hash className="w-4 h-4" />
                  {book.page_count} pages
                </div>
              )}
              {book.publisher && (
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  Published by {book.publisher}
                </span>
              )}
            </div>
          </div>

          {/* Write a Review */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-lg mb-5 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Star className="w-5 h-5 text-amber-500" />
              Write a Review
            </h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview((p) => ({ ...p, rating: star }))}
                    className="hover:scale-110 transition"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= newReview.rating
                          ? 'text-amber-500 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview((p) => ({ ...p, comment: e.target.value }))}
                placeholder="Share your thoughts about this book…"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition"
              >
                <Send className="w-4 h-4" />
                {submittingReview ? 'Posting…' : 'Post Review'}
              </button>
            </form>
          </div>

          {/* Reviews list */}
          <div>
            <h3 className="font-semibold text-xl mb-5 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <User className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />
              Community Reviews
              {book.reviews.length > 0 && (
                <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
                  ({book.reviews.length})
                </span>
              )}
            </h3>
            {book.reviews.length > 0 ? (
              <div className="space-y-4">
                {book.reviews.map((review) => (
                  <ReviewCard
                    key={review.uid.slice(0,4)}
                    review={review}
                    onDeleted={handleReviewDeleted}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 py-8 text-center">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Book"
          message={`Delete "${book.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default BookDetail;
