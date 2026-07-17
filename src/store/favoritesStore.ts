import { create } from 'zustand';
import { favoriteService } from '../services/favoriteService';
import { toast } from 'react-hot-toast';

interface FavoritesState {
  favoriteUids: Set<string>;
  loading: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  reset: () => void;
  toggle: (bookUid: string) => Promise<void>;
  isFavorited: (bookUid: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteUids: new Set(),
  loading: false,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    set({ loading: true });
    try {
      const books = await favoriteService.getFavorites();
      set({
        favoriteUids: new Set(books.map((b) => b.book_uid)),
        hydrated: true,
      });
    } catch {
      // silently fail — user may not be authenticated yet
    } finally {
      set({ loading: false });
    }
  },

  /** Call on logout to clear stale favorite state */
  reset: () => set({ favoriteUids: new Set(), hydrated: false }),

  toggle: async (bookUid: string) => {
    const { favoriteUids } = get();
    const alreadyFavorited = favoriteUids.has(bookUid);

    // Optimistic update
    const next = new Set(favoriteUids);
    alreadyFavorited ? next.delete(bookUid) : next.add(bookUid);
    set({ favoriteUids: next });

    try {
      if (alreadyFavorited) {
        await favoriteService.removeFavorite(bookUid);
        toast.success('Removed from favorites');
      } else {
        await favoriteService.addFavorite(bookUid);
        toast.success('Added to favorites');
      }
    } catch {
      // Roll back
      set({ favoriteUids });
      toast.error('Failed to update favorites');
    }
  },

  isFavorited: (bookUid: string) => get().favoriteUids.has(bookUid),
}));
