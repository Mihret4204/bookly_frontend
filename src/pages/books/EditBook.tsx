import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BookForm from '../../components/books/BookForm';
import { bookService } from '../../services/bookService';
import type { Book, BookCreateData } from '../../types';

const EditBook = () => {
  const { book_uid } = useParams<{ book_uid: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!book_uid) return;
    bookService
      .getBookById(book_uid)
      .then(setBook)
      .catch(() => {
        toast.error('Book not found');
        navigate('/books');
      })
      .finally(() => setLoadingBook(false));
  }, [book_uid, navigate]);

  const handleUpdate = async (data: BookCreateData) => {
    if (!book) return;
    setSaving(true);
    try {
      await bookService.updateBook(book.book_uid, {
        title: data.title,
        author: data.author,
        publisher: data.publisher,
        published_date: data.published_date,
        page_count: data.page_count,
        language: data.language,
      });
      toast.success('Book updated successfully');
      navigate(`/books/${book.book_uid}`);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      toast.error(err?.message || (typeof detail === 'string' ? detail : 'Failed to update book'));
    } finally {
      setSaving(false);
    }
  };

  if (loadingBook) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading book…</p>
      </div>
    );
  }

  if (!book) return null;

  const initialValues: Partial<BookCreateData> = {
    title: book.title,
    author: book.author,
    publisher: book.publisher ?? '',
    published_date: book.published_date ?? '',
    page_count: book.page_count,
    language: book.language ?? '',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to={`/books/${book.book_uid}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Book
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl">
            <Pencil className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Book</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{book.title}</p>
          </div>
        </div>
        <BookForm
          initialValues={initialValues}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
          loading={saving}
        />
      </div>
    </div>
  );
};

export default EditBook;
