import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  // Do NOT set a default Content-Type here.
  // Axios sets 'application/json' for plain objects automatically,
  // and 'multipart/form-data' with the correct boundary for FormData.
  // A hardcoded default would override the boundary on file uploads → 422.
});

const isProtectedPath = (pathname: string) => {
  if (pathname.startsWith('/home')) return true;
  if (pathname.startsWith('/favorites')) return true;
  if (pathname.startsWith('/profile')) return true;
  if (pathname.startsWith('/books/create_book')) return true;
  if (pathname.startsWith('/books/') && pathname.includes('/edit')) return true;
  return false;
};

const getErrorMessage = (error: any) => {
  const detail = error?.response?.data?.detail ?? error?.response?.data?.message;
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (error?.response?.status === 401) return 'Your session has expired. Please sign in again.';
  if (error?.response?.status === 403) return 'You do not have permission to perform that action.';
  return error?.message || 'Something went wrong. Please try again.';
};

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = getErrorMessage(error);

    if (status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && isProtectedPath(window.location.pathname)) {
        window.location.assign('/login');
      }
    }

    const normalizedError = error as Error & { message: string };
    normalizedError.message = message;
    return Promise.reject(normalizedError);
  }
);

export default api;
