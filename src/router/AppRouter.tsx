import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

import MainLayout from '../components/layout/MainLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/home/Home';
import BookList from '../pages/books/BookList';
import BookDetail from '../pages/books/BookDetail';
import CreateBook from '../pages/books/CreateBook';
import EditBook from '../pages/books/EditBook';
import Favorites from '../pages/favorites/Favorites';
import Profile from '../pages/profile/Profile';
import About from '../public/About';

const ProtectedRoute = () => {
  const { isAuthenticated, user, setUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user) return;

    authService
      .getCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => undefined);
  }, [isAuthenticated, user, setUser]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/home" replace />;
};

// Controls the landing experience
const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();
  // If logged in, skip About page and go straight to internal home
  return isAuthenticated ? <Navigate to="/home" replace /> : <About />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 
          1. PUBLIC LANDING & AUTH CHANNELS (No Navbars)
        */}
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 
          2. INTERNAL / PROTECTED PLATFORM (Wrapped in your interactive MainLayout)
        */}
        <Route element={<MainLayout />}>
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:book_uid" element={<BookDetail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/books/create_book" element={<CreateBook />} />
            <Route path="/books/:book_uid/edit" element={<EditBook />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch-all: Unauthenticated go to About, Authenticated go to internal Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
     
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;