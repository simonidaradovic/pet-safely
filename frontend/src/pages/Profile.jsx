import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  Search,
  ShieldAlert,
  Trash2,
  User,
} from 'lucide-react';

import { useAuthStore } from '../stores/auth.store';
import { useHazardsStore } from '../stores/hazards.store';

import EditHazardModal from '../components/profile/EditHazardModal';
import ConfirmModal from '../components/profile/ConfirmModal';

const STATUS_META = {
  OPEN: { label: 'Open', icon: ShieldAlert },
  IN_PROGRESS: { label: 'In progress', icon: Clock },
  RESOLVED: { label: 'Resolved', icon: CheckCircle2 },
};

const CATEGORY_LABEL = {
  TICKS: 'Ticks',
  POISON: 'Poison',
  AGGRESSIVE_DOG: 'Aggressive dog',
  BROKEN_GLASS: 'Broken glass',
  OTHER: 'Other',
};

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  const hazards = useHazardsStore((s) => s.hazards);
  const loading = useHazardsStore((s) => s.loading);
  const error = useHazardsStore((s) => s.error);
  const clearError = useHazardsStore((s) => s.clearError);

  const list = useHazardsStore((s) => s.list);
  const setStatus = useHazardsStore((s) => s.setStatus);
  const remove = useHazardsStore((s) => s.remove);

  // local UI filters
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // modals
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    clearError();
    list({ limit: 500 });
  }, []);

  const myHazards = useMemo(() => {
    const uid = user?.id;
    if (!uid) return [];

    const mine = (hazards || []).filter(
      (h) => h?.user?.id === uid || h?.userId === uid,
    );

    const query = q.trim().toLowerCase();

    return mine
      .filter((h) => {
        if (statusFilter && h.status !== statusFilter) return false;
        if (categoryFilter && h.category !== categoryFilter) return false;
        if (!query) return true;

        const hay =
          `${h.title || ''} ${h.description || ''} ${h.address || ''}`.toLowerCase();
        return hay.includes(query);
      })
      .sort((a, b) => {
        const da = new Date(a.reportedAt || a.createdAt || 0).getTime();
        const db = new Date(b.reportedAt || b.createdAt || 0).getTime();
        return db - da;
      });
  }, [hazards, user?.id, q, statusFilter, categoryFilter]);

  const openEdit = (hazard) => {
    setEditing(hazard);
    setEditOpen(true);
  };

  const openDelete = (hazard) => {
    setDeleting(hazard);
    setConfirmOpen(true);
  };

  const onChangeStatus = async (hazard, nextStatus) => {
    try {
      await setStatus(hazard.id, nextStatus);
    } catch {}
  };

  const onDelete = async () => {
    if (!deleting) return;
    try {
      await remove(deleting.id);
      setConfirmOpen(false);
      setDeleting(null);
    } catch {}
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-xl font-semibold text-slate-900'>Profile</h1>
            <p className='mt-1 text-sm text-slate-600'>
              Manage the hazards you reported.
            </p>
          </div>

          <div className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2'>
            <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700'>
              <User className='h-4 w-4' />
            </span>
            <div className='min-w-0'>
              <div className='truncate text-sm font-medium text-slate-900'>
                {user?.name || 'User'}
              </div>
              <div className='truncate text-xs text-slate-500'>
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-12'>
          <div className='md:col-span-6'>
            <label className='mb-1 block text-xs font-medium text-slate-600'>
              Search
            </label>
            <div className='relative'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder='Search title, description or address...'
                className='w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400'
              />
            </div>
          </div>

          <div className='md:col-span-3'>
            <label className='mb-1 block text-xs font-medium text-slate-600'>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400'
            >
              <option value=''>All</option>
              <option value='OPEN'>Open</option>
              <option value='IN_PROGRESS'>In progress</option>
              <option value='RESOLVED'>Resolved</option>
            </select>
          </div>

          <div className='md:col-span-3'>
            <label className='mb-1 block text-xs font-medium text-slate-600'>
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
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
        </div>

        {/* Error */}
        {error ? (
          <div className='mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            <AlertCircle className='mt-0.5 h-4 w-4' />
            <div>{error}</div>
          </div>
        ) : null}
      </div>

      {/* List */}
      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-semibold text-slate-900'>
            Your hazards ({myHazards.length})
          </h2>

          {loading ? (
            <div className='inline-flex items-center gap-2 text-sm text-slate-600'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading...
            </div>
          ) : null}
        </div>

        {myHazards.length === 0 ? (
          <div className='mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700'>
            You haven&apos;t reported any hazards yet.
          </div>
        ) : (
          <div className='mt-4 grid gap-3'>
            {myHazards.map((h) => {
              const meta = STATUS_META[h.status] || STATUS_META.OPEN;
              const StatusIcon = meta.icon;

              return (
                <div
                  key={h.id}
                  className='rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50'
                >
                  <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                    <div className='min-w-0'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <div className='truncate text-base font-semibold text-slate-900'>
                          {h.title}
                        </div>

                        <span className='inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700'>
                          <StatusIcon className='h-3.5 w-3.5' />
                          {meta.label}
                        </span>

                        <span className='inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white'>
                          {CATEGORY_LABEL[h.category] || 'Other'}
                        </span>
                      </div>

                      {h.description ? (
                        <div className='mt-2 text-sm text-slate-700'>
                          {h.description}
                        </div>
                      ) : null}

                      <div className='mt-2 text-xs text-slate-500'>
                        {h.address
                          ? `📍 ${h.address}`
                          : `📍 ${h.lat}, ${h.lng}`}
                      </div>

                      <div className='mt-1 text-xs text-slate-500'>
                        Reported:{' '}
                        {new Date(h.reportedAt || h.createdAt).toLocaleString()}
                        {h.resolvedAt
                          ? ` • Resolved: ${new Date(h.resolvedAt).toLocaleString()}`
                          : ''}
                      </div>
                    </div>

                    <div className='flex flex-col gap-2 sm:flex-row md:flex-col md:items-end'>
                      {/* Status select */}
                      <select
                        value={h.status || 'OPEN'}
                        onChange={(e) => onChangeStatus(h, e.target.value)}
                        disabled={loading}
                        className={cx(
                          'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 md:w-[180px]',
                          loading && 'opacity-60',
                        )}
                      >
                        <option value='OPEN'>Open</option>
                        <option value='IN_PROGRESS'>In progress</option>
                        <option value='RESOLVED'>Resolved</option>
                      </select>

                      <div className='flex gap-2'>
                        <button
                          onClick={() => openEdit(h)}
                          className='inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
                        >
                          <Pencil className='h-4 w-4' />
                          Edit
                        </button>

                        <button
                          onClick={() => openDelete(h)}
                          className='inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100'
                        >
                          <Trash2 className='h-4 w-4' />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit modal */}
      <EditHazardModal
        open={editOpen}
        hazard={editing}
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
        }}
      />

      {/* Confirm delete modal */}
      <ConfirmModal
        open={confirmOpen}
        title='Delete hazard?'
        description={`This will permanently delete "${deleting?.title || ''}".`}
        confirmText='Delete'
        confirmVariant='danger'
        loading={loading}
        onClose={() => {
          setConfirmOpen(false);
          setDeleting(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
}
