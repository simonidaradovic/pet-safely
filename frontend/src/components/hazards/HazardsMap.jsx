import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Bug,
  Skull,
  Dog,
  GlassWater,
  AlertCircle,
  MousePointerClick,
  X,
} from 'lucide-react';

import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker1x from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker1x,
  shadowUrl: markerShadow,
});

// Belgrade center
const BELGRADE = [44.7866, 20.4489];

const CATEGORY_META = {
  TICKS: { label: 'Ticks', Icon: Bug },
  POISON: { label: 'Poison', Icon: Skull },
  AGGRESSIVE_DOG: { label: 'Aggressive dog', Icon: Dog },
  BROKEN_GLASS: { label: 'Broken glass', Icon: GlassWater },
  OTHER: { label: 'Other', Icon: AlertCircle },
};

function ViewportWatcher({ onBoundsChange }) {
  useMapEvents({
    moveend: (e) => {
      const b = e.target.getBounds();
      onBoundsChange?.({
        minLat: b.getSouth(),
        maxLat: b.getNorth(),
        minLng: b.getWest(),
        maxLng: b.getEast(),
      });
    },
    zoomend: (e) => {
      const b = e.target.getBounds();
      onBoundsChange?.({
        minLat: b.getSouth(),
        maxLat: b.getNorth(),
        minLng: b.getWest(),
        maxLng: b.getEast(),
      });
    },
  });
  return null;
}

function ClickPicker({ enabled, onPick }) {
  useMapEvents({
    click: (e) => {
      if (!enabled) return;
      onPick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function makeDivIcon(cat) {
  const meta = CATEGORY_META[cat] || CATEGORY_META.OTHER;
  return L.divIcon({
    className: 'petsafely-marker',
    html: `
      <div style="
        display:flex; align-items:center; justify-content:center;
        width:34px; height:34px; border-radius:999px;
        background:#0f172a; color:white;
        box-shadow:0 8px 20px rgba(15,23,42,.25);
        border:2px solid white;
        font-size:14px;
      ">
        <span style="line-height:1;">📍</span>
      </div>
      <div style="
        margin-top:4px;
        display:inline-flex; align-items:center; justify-content:center;
        padding:2px 6px; border-radius:999px;
        background:white; color:#0f172a;
        border:1px solid rgba(15,23,42,.15);
        font-size:10px; font-weight:600;
        box-shadow:0 8px 20px rgba(15,23,42,.12);
        white-space:nowrap;
      ">
        ${meta.label}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

export default function HazardsMap({
  pins,
  loading,
  error,
  addMode,
  onCancelAdd,
  onPick,
  onBoundsChange,
}) {
  return (
    <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
      <div className='relative h-[70vh] w-full'>
        {/* add-mode helper overlay */}
        {addMode ? (
          <div className='absolute left-4 top-4 z-[1000] flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur'>
            <MousePointerClick className='h-4 w-4 text-slate-700' />
            <span className='font-medium'>Click on the map</span>
            <span className='text-slate-500'>to place a problem</span>

            <button
              onClick={onCancelAdd}
              className='ml-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100'
            >
              <X className='h-3.5 w-3.5' />
              Cancel
            </button>
          </div>
        ) : null}

        <MapContainer
          center={BELGRADE}
          zoom={12}
          scrollWheelZoom
          className='h-full w-full'
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          <ViewportWatcher onBoundsChange={onBoundsChange} />
          <ClickPicker enabled={addMode} onPick={onPick} />

          {(pins || []).map((h) => {
            const meta = CATEGORY_META[h.category] || CATEGORY_META.OTHER;
            const Icon = meta.Icon;

            return (
              <Marker
                key={h.id}
                position={[h.latN, h.lngN]}
                icon={makeDivIcon(h.category)}
              >
                <Popup>
                  <div className='min-w-[220px]'>
                    <div className='flex items-start gap-2'>
                      <div className='mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white'>
                        <Icon className='h-4 w-4' />
                      </div>
                      <div className='flex-1'>
                        <div className='text-sm font-semibold text-slate-900'>
                          {h.title}
                        </div>
                        <div className='mt-0.5 text-xs text-slate-600'>
                          {meta.label} •{' '}
                          {String(h.status || 'OPEN').replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    {h.description ? (
                      <div className='mt-2 text-sm text-slate-700'>
                        {h.description}
                      </div>
                    ) : null}

                    <div className='mt-2 text-xs text-slate-500'>
                      {h.address
                        ? `📍 ${h.address}`
                        : `Lat: ${h.latN}, Lng: ${h.lngN}`}
                    </div>

                    <div className='mt-2 text-xs text-slate-500'>
                      Reported by: {h.user?.name || 'User'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {loading ? (
          <div className='absolute bottom-4 left-4 z-[1000] rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur'>
            Loading hazards...
          </div>
        ) : null}

        {error ? (
          <div className='absolute bottom-4 right-4 z-[1000] max-w-[320px] rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm'>
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
