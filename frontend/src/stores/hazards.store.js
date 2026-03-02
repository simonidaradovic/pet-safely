import { create } from 'zustand';
import { apiFetch } from '../lib/api';

function toQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const useHazardsStore = create((set, get) => ({
  hazards: [],
  selected: null,

  loading: false,
  error: null,

  filters: {
    category: '',
    status: '',
    q: '',
    days: '',
    minLat: '',
    maxLat: '',
    minLng: '',
    maxLng: '',
    limit: 200,
  },

  clearError: () => set({ error: null }),

  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),

  resetFilters: () =>
    set({
      filters: {
        category: '',
        status: '',
        q: '',
        days: '',
        minLat: '',
        maxLat: '',
        minLng: '',
        maxLng: '',
        limit: 200,
      },
    }),

  list: async (override = {}) => {
    set({ loading: true, error: null });
    try {
      const filters = { ...get().filters, ...override };
      const data = await apiFetch(`/api/hazards${toQuery(filters)}`, {
        method: 'GET',
      });
      set({ hazards: data.hazards || [], loading: false });
      return data.hazards || [];
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  getById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/api/hazards/${id}`, { method: 'GET' });
      set({ selected: data.hazard, loading: false });
      return data.hazard;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  create: async ({ title, description, category, lat, lng, address }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/api/hazards', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category,
          lat,
          lng,
          address,
        }),
      });

      set((state) => ({
        hazards: [data.hazard, ...state.hazards],
        loading: false,
      }));

      return data.hazard;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  update: async (id, patch) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/api/hazards/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });

      set((state) => ({
        hazards: state.hazards.map((h) =>
          h.id === id ? { ...h, ...data.hazard } : h,
        ),
        selected:
          state.selected?.id === id
            ? { ...state.selected, ...data.hazard }
            : state.selected,
        loading: false,
      }));

      return data.hazard;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  setStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/api/hazards/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      set((state) => ({
        hazards: state.hazards.map((h) =>
          h.id === id
            ? {
                ...h,
                status: data.hazard.status,
                resolvedAt: data.hazard.resolvedAt,
              }
            : h,
        ),
        selected:
          state.selected?.id === id
            ? {
                ...state.selected,
                status: data.hazard.status,
                resolvedAt: data.hazard.resolvedAt,
              }
            : state.selected,
        loading: false,
      }));

      return data.hazard;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiFetch(`/api/hazards/${id}`, { method: 'DELETE' });

      set((state) => ({
        hazards: state.hazards.filter((h) => h.id !== id),
        selected: state.selected?.id === id ? null : state.selected,
        loading: false,
      }));
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },
}));
