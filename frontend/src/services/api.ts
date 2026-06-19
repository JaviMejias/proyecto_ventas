import { MenuItem, Addon } from '../types';

export const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3002';
const API_BASE = `${API_URL}/api/v1`;

const customFetch = (url: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  
  // Devise expects JSON requests to return JSON properly instead of redirecting
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  return fetch(url, { ...options, headers, credentials: 'include' });
};

export const api = {
  // --- AUTH ---
  getCsrfToken: async (): Promise<{ csrf_token: string }> => {
    const res = await customFetch(`${API_BASE}/auth/csrf_token`);
    if (!res.ok) throw new Error('Failed to get CSRF token');
    return res.json();
  },
  getCurrentUser: async (): Promise<any> => {
    const res = await customFetch(`${API_BASE}/auth/me`);
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },
  login: async (credentials: any): Promise<any> => {
    const res = await customFetch(`${API_URL}/users/sign_in.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: credentials }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Correo o contraseña incorrectos');
    }
    return res.json();
  },
  register: async (data: any): Promise<any> => {
    const res = await customFetch(`${API_URL}/users.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: data }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.errors ? JSON.stringify(errData.errors) : 'Error al registrarse');
    }
    return res.json();
  },
  logout: async (): Promise<void> => {
    await customFetch(`${API_URL}/users/sign_out.json`, { method: 'DELETE' });
  },
  // --- APP ---
  getMenuItems: async (): Promise<MenuItem[]> => {
    const res = await customFetch(`${API_BASE}/menu_items`);
    return res.json();
  },
  createMenuItem: async (payload: Partial<MenuItem>): Promise<MenuItem> => {
    const res = await customFetch(`${API_BASE}/menu_items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menu_item: payload }),
    });
    if (!res.ok) throw new Error('Error al crear el plato');
    return res.json();
  },
  updateMenuItem: async (id: number, payload: Partial<MenuItem>): Promise<MenuItem> => {
    const res = await customFetch(`${API_BASE}/menu_items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menu_item: payload }),
    });
    if (!res.ok) throw new Error('Error al actualizar el plato');
    return res.json();
  },
  deleteMenuItem: async (id: number): Promise<void> => {
    const res = await customFetch(`${API_BASE}/menu_items/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || 'Error al eliminar el plato');
    }
  },
  getAddons: async (): Promise<Addon[]> => {
    const res = await customFetch(`${API_BASE}/addons`);
    return res.json();
  },
  createAddon: async (payload: Partial<Addon>): Promise<Addon> => {
    const res = await customFetch(`${API_BASE}/addons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addon: payload }),
    });
    if (!res.ok) throw new Error('Error al crear el agregado');
    return res.json();
  },
  updateAddon: async (id: number, payload: Partial<Addon>): Promise<Addon> => {
    const res = await customFetch(`${API_BASE}/addons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addon: payload }),
    });
    if (!res.ok) throw new Error('Error al actualizar el agregado');
    return res.json();
  },
  deleteAddon: async (id: number): Promise<void> => {
    const res = await customFetch(`${API_BASE}/addons/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar el agregado');
  },
  getSells: async (page: number = 1): Promise<any> => {
    const res = await customFetch(`${API_BASE}/sells?page=${page}`);
    if (!res.ok) throw new Error('Error al obtener historial');
    return res.json();
  },
  exportSalesExcel: async (colorHex?: string): Promise<void> => {
    const url = new URL(`${API_BASE}/sells/export_excel`);
    if (colorHex) {
      url.searchParams.append('color', colorHex.replace('#', ''));
    }
    const res = await customFetch(url.toString(), {
      headers: { Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    });
    if (!res.ok) throw new Error('Error al exportar ventas');
    
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    const date = new Date();
    a.download = `ventas_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  },
  getSell: async (id: number): Promise<any> => {
    const res = await customFetch(`${API_BASE}/sells/${id}`);
    if (!res.ok) throw new Error('Error al obtener venta');
    return res.json();
  },
  createSell: async (data: any): Promise<any> => {
    const res = await customFetch(`${API_BASE}/sells`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.errors?.join(', ') || 'Error al procesar la venta');
    }
    return res.json();
  },
  updateSellStatus: async (id: number, status: string): Promise<any> => {
    const res = await customFetch(`${API_BASE}/sells/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sell: { status } }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado');
    return res.json();
  },
  getCashCloses: async (page: number = 1): Promise<any> => {
    const res = await customFetch(`${API_BASE}/cash_closes?page=${page}`);
    if (!res.ok) throw new Error('Error al obtener cierres');
    return res.json();
  },
  exportCashClosesExcel: async (colorHex?: string): Promise<void> => {
    const url = new URL(`${API_BASE}/cash_closes/export_excel`);
    if (colorHex) {
      url.searchParams.append('color', colorHex.replace('#', ''));
    }
    const res = await customFetch(url.toString(), {
      headers: { Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    });
    if (!res.ok) throw new Error('Error al exportar cierres de caja');
    
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    const date = new Date();
    a.download = `cierres_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  },
  getCashClose: async (id: number): Promise<any> => {
    const res = await customFetch(`${API_BASE}/cash_closes/${id}`);
    if (!res.ok) throw new Error('Error al obtener detalle del cierre');
    return res.json();
  },
  getCashClosePreview: async (mode: 'personal' | 'global' = 'personal'): Promise<any> => {
    const url = `${API_BASE}/cash_closes/preview?mode=${mode}`;
    const res = await customFetch(url);
    if (!res.ok) throw new Error('Error al obtener la previsualización');
    return res.json();
  },
  createCashClose: async (mode: 'personal' | 'global' = 'personal'): Promise<any> => {
    const res = await customFetch(`${API_BASE}/cash_closes?mode=${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cash_close: {} }),
    });
    if (!res.ok) throw new Error('Error al crear el cierre de caja');
    return res.json();
  },
};
