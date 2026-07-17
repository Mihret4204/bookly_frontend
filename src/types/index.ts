// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  uid: string;
  user_uid: string;   // backend also returns this alias
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  role?: string;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  books?: Book[];
  _favorites_count?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

// ─── Books ────────────────────────────────────────────────────────────────────

export interface BookCreator {
  uid: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface Book {
  book_uid: string;   // normalised from backend's `uid`
  title: string;
  author: string;
  publisher?: string;
  published_date?: string;
  page_count?: number;
  language?: string;
  cover_url?: string;
  cover_image_path?: string;
  user_uid?: string;
  creator?: BookCreator;
  created_at?: string;
  updated_at?: string;
}

export interface BookDetail extends Book {
  reviews: Review[];
}

export interface BookCreateData {
  title: string;
  author: string;
  publisher?: string;
  published_date?: string;
  page_count?: number;
  language?: string;
}

export interface BookUpdateData {
  title: string;
  author: string;
  publisher?: string;
  published_date?: string;
  page_count?: number;
  language?: string;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  uid: string;
  rating: number;
  review_text?: string;
  user_uid?: string;
  book_uid?: string;
  created_at: string;
  updated_at?: string;
}

export interface ReviewCreateData {
  rating: number;
  review_text: string;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}
