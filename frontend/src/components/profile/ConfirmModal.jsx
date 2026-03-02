import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirm',
  confirmVariant = 'default',
  loading = false,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  const confirmClasses =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-slate-900 hover:bg-slate-800';

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center px-4'>
      <button
        className='absolute inset-0 bg-black/40'
        onClick={onClose}
        aria-label='Close modal'
      />

      <div className='relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-start gap-3'>
            <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700'>
              <AlertTriangle className='h-5 w-5' />
            </span>
            <div>
              <h2 className='text-base font-semibold text-slate-900'>
                {title}
              </h2>
              {description ? (
                <p className='mt-1 text-sm text-slate-600'>{description}</p>
              ) : null}
            </div>
          </div>

          <button
            onClick={onClose}
            className='inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50'
            aria-label='Close'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end'>
          <button
            onClick={onClose}
            className='inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50'
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-60 ${confirmClasses}`}
          >
            {loading ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
