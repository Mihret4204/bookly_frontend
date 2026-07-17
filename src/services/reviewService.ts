import api from './api';
import type { Review, ReviewCreateData } from '../types';

export const reviewService = {
  /** POST /reviews/book/{bookUid} → Review */
  addReview: async (bookUid: string, payload: ReviewCreateData): Promise<Review> => {
    const { data } = await api.post(`/reviews/book/${bookUid}`, payload);
    return data as Review;
  },

  /** DELETE /reviews/{reviewUid} */
  deleteReview: async (reviewUid: string): Promise<void> => {
    await api.delete(`/reviews/${reviewUid}`);
  },
};
