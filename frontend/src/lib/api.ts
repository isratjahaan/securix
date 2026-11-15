/**
 * SIS CYBER FORTRESS API Client
 * Enterprise-grade fetch wrapper with token management, user/admin session routing, and type safety.
 */

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isBrowser = typeof window !== 'undefined';
  const isAdminPath = isBrowser && window.location.pathname.startsWith('/admin');

  // Use appropriate token depending on route context (admin vs user)
  const token = isBrowser
    ? isAdminPath
      ? localStorage.getItem('sis_auth_token') || localStorage.getItem('sis_user_token')
      : localStorage.getItem('sis_user_token') || localStorage.getItem('sis_auth_token')
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && isBrowser && !window.location.pathname.includes('/login')) {
      if (isAdminPath) {
        localStorage.removeItem('sis_auth_token');
        localStorage.removeItem('sis_admin_user');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('sis_user_token');
        localStorage.removeItem('sis_user');
        window.location.href = '/login';
      }
      throw new ApiError('Unauthorized session', 401);
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new ApiError(data?.message || `Request failed with status ${res.status}`, res.status, data);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Network communication error with backend API', 500);
  }
}

export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T = any>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
