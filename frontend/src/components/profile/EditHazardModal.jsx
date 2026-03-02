import { useEffect, useState } from 'react';
import { X, AlertCircle, Save } from 'lucide-react';
import { useHazardsStore } from '../../stores/hazards.store';

export default function EditHazardModal({ open, hazard, onClose }) {
  const update = useHazardsStore((s) => s.update);
  const loading = useHazardsStore((s) => s.loading);
  const error = useHazardsStore((s) => s.error);
  const clearError = useHazardsStore((s) => s.clearError);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!open) return;
    clearError();
    setTitle(hazard?.title || '');
    setDescription(hazard?.description || '');
    setCategory(hazard?.category || 'OTHER');
    setAddress(hazard?.address || '');
  }, [open, hazard, clearError]);

  if (!open || !hazard) return null;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await update(hazard.id, {
        title,
        description,
        category,
        address: address || null,
      });
      onClose?.();
    } catch {}
  };

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center px-4'>
      <button
        className='absolute inset-0 bg-black/40'
        onClick={onClose}
        aria-label='Close modal'
      />

      <div className='relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <h2 className='text-lg font-semibold text-slate-900'>
              Edit hazard
            </h2>
            <p className='mt-1 text-sm text-slate-600'>
              Update details for this hazard.
            </p>
          </div>

          <button
            onClick={onClose}
            className='inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50'
            aria-label='Close'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {error ? (
          <div className='mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            <AlertCircle className='mt-0.5 h-4 w-4' />
            <div>{error}</div>
          </div>
        ) : null}

        <form onSubmit={submit} className='mt-4 space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400'
            >
              <option value='TICKS'>Ticks</option>
              <option value='POISON'>Poison</option>
              <option value='AGGRESSIVE_DOG'>Aggressive dog</option>
              <option value='BROKEN_GLASS'>Broken glass</option>
              <option value='OTHER'>Other</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className='w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>
              Address (optional)
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400'
            />
          </div>

          <div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={loading}
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60'
            >
              <Save className='h-4 w-4' />
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
