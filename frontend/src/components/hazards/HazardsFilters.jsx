import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { useHazardsStore } from '../../stores/hazards.store';

export default function HazardsFilters() {
  const loading = useHazardsStore((s) => s.loading);
  const error = useHazardsStore((s) => s.error);

  const filters = useHazardsStore((s) => s.filters);
  const setFilters = useHazardsStore((s) => s.setFilters);
  const list = useHazardsStore((s) => s.list);

  const [q, setQ] = useState(filters.q || '');
  const [category, setCategory] = useState(filters.category || '');
  const [status, setStatus] = useState(filters.status || '');
  const [days, setDays] = useState(filters.days || '');

  useEffect(() => {
    setQ(filters.q || '');
    setCategory(filters.category || '');
    setStatus(filters.status || '');
    setDays(filters.days || '');
  }, [filters.q, filters.category, filters.status, filters.days]);

  const applyFilters = async (e) => {
    e.preventDefault();
    const next = { q, category, status, days };
    setFilters(next);
    await list(next);
  };

  const reset = async () => {
    setQ('');
    setCategory('');
    setStatus('');
    setDays('');
    const next = { q: '', category: '', status: '', days: '' };
    setFilters(next);
    await list(next);
  };

  return (
    <form
      onSubmit={applyFilters}
      className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-12'
    >
      <div className='md:col-span-5'>
        <label className='mb-1 block text-xs font-medium text-slate-600'>
          Search
        </label>
        <div className='relative'>
          <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Title or description...'
            className='w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400'
          />
        </div>
      </div>

      <div className='md:col-span-3'>
        <label className='mb-1 block text-xs font-medium text-slate-600'>
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400'
        >
          <option value=''>All</option>
          <option value='TICKS'>Ticks</option>
          <option value='POISON'>Poison</option>
          <option value='AGGRESSIVE_DOG'>Aggressive dog</option>
          <option value='BROKEN_GLASS'>Broken glass</option>
          <option value='OTHER'>Other</option>
        </select>
      </div>

      <div className='md:col-span-2'>
        <label className='mb-1 block text-xs font-medium text-slate-600'>
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400'
        >
          <option value=''>All</option>
          <option value='OPEN'>Open</option>
          <option value='IN_PROGRESS'>In progress</option>
          <option value='RESOLVED'>Resolved</option>
        </select>
      </div>

      <div className='md:col-span-2'>
        <label className='mb-1 block text-xs font-medium text-slate-600'>
          Last days
        </label>
        <input
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder='e.g. 7'
          inputMode='numeric'
          className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400'
        />
      </div>

      <div className='md:col-span-12 flex flex-col gap-2 sm:flex-row sm:items-center'>
        <button
          type='submit'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800'
        >
          <SlidersHorizontal className='h-4 w-4' />
          Apply
        </button>

        <button
          type='button'
          onClick={reset}
          className='inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
        >
          Reset
        </button>

        <div className='flex-1' />

        {loading ? (
          <div className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600'>
            <span className='h-2 w-2 animate-pulse rounded-full bg-slate-400' />
            Loading hazards...
          </div>
        ) : null}
      </div>

      {error ? (
        <div className='md:col-span-12 mt-1 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
          <AlertCircle className='mt-0.5 h-4 w-4' />
          <div>{error}</div>
        </div>
      ) : null}
    </form>
  );
}
