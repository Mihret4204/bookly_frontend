import { useState } from 'react';
import type { BookCreateData } from '../../types';

interface BookFormProps {
  initialValues?: Partial<BookCreateData>;
  onSubmit: (data: BookCreateData) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

const EMPTY: BookCreateData = {
  title: '',
  author: '',
  publisher: '',
  published_date: '',
  page_count: undefined,
  language: '',
};

const BookForm = ({
  initialValues,
  onSubmit,
  submitLabel = 'Save Book',
  loading = false,
}: BookFormProps) => {
  const [form, setForm] = useState<BookCreateData>({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState<Partial<Record<keyof BookCreateData, string>>>({});

  const set = (field: keyof BookCreateData, value: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.author.trim()) errs.author = 'Author is required';
    if (form.page_count !== undefined && form.page_count < 1)
      errs.page_count = 'Page count must be at least 1';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload: BookCreateData = {
      title: form.title.trim(),
      author: form.author.trim(),
      publisher: form.publisher?.trim() || undefined,
      published_date: form.published_date?.trim() || undefined,
      page_count: form.page_count || undefined,
      language: form.language?.trim() || undefined,
    };
    await onSubmit(payload);
  };

  const inputBase =
    'w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500';

  const field = (
    id: keyof BookCreateData,
    label: string,
    inputProps: React.InputHTMLAttributes<HTMLInputElement>
  ) => {
    const err = errors[id];
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
          {label}
        </label>
        <input
          id={id}
          value={(form[id] as string | number) ?? ''}
          onChange={(e) =>
            set(id, inputProps.type === 'number' ? Number(e.target.value) || undefined : e.target.value)
          }
          className={`${inputBase} ${err ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
          {...inputProps}
        />
        {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {field('title', 'Title *', { placeholder: 'e.g. The Great Gatsby', required: true })}
        {field('author', 'Author *', { placeholder: 'e.g. F. Scott Fitzgerald', required: true })}
        {field('publisher', 'Publisher', { placeholder: 'e.g. Scribner' })}
        {field('published_date', 'Published Date', { type: 'date' })}
        {field('page_count', 'Page Count', { type: 'number', min: 1, placeholder: '320' })}
        {field('language', 'Language', { placeholder: 'e.g. English' })}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
