import { Trash2, User, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Review } from '../../types';
import { reviewService } from '../../services/reviewService';
import { useAuthStore } from '../../store/authStore';
import ConfirmModal from '../common/ConfirmModal';

interface ReviewCardProps {
  review: Review;
  /** Called after a successful delete so the parent can remove it from state */
  onDeleted?: (reviewUid: string) => void;
}

const ReviewCard = ({ review, onDeleted }: ReviewCardProps) => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Only the review's owner can delete it
  const canDelete = !!user && (user.user_uid === review.user_uid || user.uid === review.user_uid);

  const reviewIdentity = review as Review & {
    username?: string;
    user_name?: string;
    user?: {
      username?: string;
      first_name?: string;
      last_name?: string;
    };
  };

  const displayName =
    reviewIdentity.user?.username
    || reviewIdentity.username
    || reviewIdentity.user_name
    || 'Anonymous';

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await reviewService.deleteReview(review.uid);
      toast.success('Review deleted');
      setShowModal(false);
      onDeleted?.(review.uid);
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar + identifier */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-indigo-500 dark:text-indigo-300" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-100 truncate">
              {displayName}
            </span>
          </div>

          {/* Stars + delete */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'text-amber-500 fill-current'
                      : 'text-gray-200 dark:text-gray-700'
                  }`}
                />
              ))}
            </div>
            {canDelete && (
              <button
                onClick={() => setShowModal(true)}
                aria-label="Delete review"
                className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {review.review_text && (
          <p className="mt-3 text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
            {review.review_text}
          </p>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          {new Date(review.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      {showModal && (
        <ConfirmModal
          title="Delete Review"
          message="Delete your review? This cannot be undone."
          confirmLabel="Delete"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ReviewCard;
