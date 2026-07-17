import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Shield, Bookmark, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      
      {/* Dedicated Landing Header (No Internal Navigation Links) */}
      <header className="w-full border-b border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Book<span className="text-indigo-600 dark:text-indigo-400">ly</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 space-y-20">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 lg:p-16">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold tracking-wide uppercase">
                Now Live
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                Bridging Readers <br />
                <span className="text-indigo-600 dark:text-indigo-400">Across Stories</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Bookly is a digital sanctuary built for book lovers. Explore community collections, build your personal bookshelf, and share reviews with readers around the globe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-indigo-600/10"
                >
                  Create Your Shelf
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Visual Frame */}
            <div className="relative hidden lg:block h-80 xl:h-96 w-full rounded-2xl overflow-hidden shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80"
                alt="Cozy library setting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Everything You Need</h2>
            <p className="text-gray-500 dark:text-gray-400">
              A minimalist application optimized to manage your virtual catalog cleanly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Community Reviews</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                See what other readers think about a book before diving into your next story.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/40 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Shelf</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Add and curate books, mark your favorites, and keep a clean history of your reading.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Built with Love</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                No cluttered feeds, no algorithm hacks—just an open library engineered by readers, for readers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-600 dark:bg-indigo-950/40 border border-transparent dark:border-indigo-900/60 rounded-3xl p-8 lg:p-12 text-center text-white space-y-6">
          <h2 className="text-3xl font-extrabold">Ready to Start Your Next Chapter?</h2>
          <p className="text-indigo-100 dark:text-indigo-300 max-w-lg mx-auto text-base">
            Join Bookly today to manage your virtual bookshelves, rate your favorites, and explore classic and trending literature.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl text-sm shadow-md hover:bg-indigo-50 transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl text-sm shadow-md transition"
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      </main>

      {/* Landing Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-900 py-6 text-center text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} Bookly. All rights reserved.
      </footer>
    </div>
  );
};

export default About;