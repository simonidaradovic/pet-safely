import { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';

import { useHazardsStore } from '../stores/hazards.store';
import { useAuthStore } from '../stores/auth.store';

import HazardsFilters from '../components/hazards/HazardsFilters';
import HazardsMap from '../components/hazards/HazardsMap';
import AddHazardModal from '../components/hazards/AddHazardModal';

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function Home() {
  const user = useAuthStore((s) => s.user);

  const hazards = useHazardsStore((s) => s.hazards);
  const loading = useHazardsStore((s) => s.loading);
  const error = useHazardsStore((s) => s.error);
  const list = useHazardsStore((s) => s.list);
  const setFilters = useHazardsStore((s) => s.setFilters);
  const clearError = useHazardsStore((s) => s.clearError);

  const [addMode, setAddMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickedPoint, setPickedPoint] = useState(null);

  useEffect(() => {
    clearError();
    list();
  }, []);

  const pins = useMemo(() => {
    return (hazards || [])
      .map((h) => ({
        ...h,
        latN: toNum(h.lat),
        lngN: toNum(h.lng),
      }))
      .filter((h) => h.latN !== null && h.lngN !== null);
  }, [hazards]);

  const onStartAdd = () => {
    if (!user) return;
    setAddMode(true);
  };

  const onCancelAdd = () => {
    setAddMode(false);
    setModalOpen(false);
    setPickedPoint(null);
  };

  const onMapPick = ({ lat, lng }) => {
    if (!addMode) return;
    setPickedPoint({ lat, lng });
    setModalOpen(true);
    setAddMode(false);
  };

  const onModalClose = () => {
    setModalOpen(false);
    setPickedPoint(null);
  };

  return (
    <div className='space-y-4'>
      {/* Top bar + filters */}
      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-xl font-semibold text-slate-900'>Map</h1>
            <p className='text-sm text-slate-600'>
              Browse reported hazards around the city.
            </p>
          </div>

          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
            <div className='flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700'>
              <MapPin className='h-4 w-4 text-slate-500' />
              <span className='font-medium'>{pins.length}</span>
              <span className='text-slate-500'>markers</span>
            </div>

            <button
              onClick={onStartAdd}
              disabled={!user}
              className='inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60'
              title={
                !user ? 'Please sign in to add a problem' : 'Add a problem'
              }
            >
              Add problem
            </button>
          </div>
        </div>

        <HazardsFilters />
      </div>

      {/* Map */}
      <HazardsMap
        pins={pins}
        loading={loading}
        error={error}
        addMode={addMode}
        onCancelAdd={onCancelAdd}
        onPick={onMapPick}
        onBoundsChange={(bbox) => setFilters(bbox)}
      />

      {/* Modal */}
      <AddHazardModal
        open={modalOpen}
        point={pickedPoint}
        onClose={onModalClose}
      />
    </div>
  );
}
