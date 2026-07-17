import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BookForm from '../../components/books/BookForm';
import { bookService } from '../../services/bookService';
import type { BookCreateData } from '../../types';

const CreateBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: BookCreateData) => {
    setLoading(true);
    try {
      const created = await bookService.createBook(data);
      toast.success('Book created successfully');
      navigate(`/books/${created.book_uid}`);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      toast.error(err?.message || (typeof detail === 'string' ? detail : 'Failed to create book'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/books"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Books
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Book</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fill in the details below to add a book to the library
            </p>
          </div>
        </div>
        <BookForm onSubmit={handleCreate} submitLabel="Create Book" loading={loading} />
      </div>
    </div>
  );
};

export default CreateBook;
