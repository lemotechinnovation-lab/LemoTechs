// API Configuration
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Normalize base URL (remove trailing slashes)
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

// Safe join to avoid double "/api" and duplicate slashes
const joinApiUrl = (base: string, endpoint: string): string => {
  const trimmedBase = base.replace(/\/+$/, '');
  const ensuredEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // If base already ends with /api and endpoint starts with /api, drop one
  if (trimmedBase.endsWith('/api') && ensuredEndpoint.startsWith('/api/')) {
    return `${trimmedBase}${ensuredEndpoint.replace(/^\/api/, '')}`;
  }
  return `${trimmedBase}${ensuredEndpoint}`.replace(/([^:]\/)\/+/, '$1/');
};

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: joinApiUrl(API_BASE_URL, '/api/auth'),
    bookings: joinApiUrl(API_BASE_URL, '/api/bookings'),
    payments: joinApiUrl(API_BASE_URL, '/api/payments'),
    uploads: joinApiUrl(API_BASE_URL, '/api/uploads'),
    serviceItems: joinApiUrl(API_BASE_URL, '/api/service-items')
  }
};

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : joinApiUrl(API_BASE_URL, endpoint);
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('lemotech_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export default apiConfig;
