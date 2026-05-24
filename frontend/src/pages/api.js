const BASE = 'http://localhost:5000/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token') || '';

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  return res;
}

// For FormData uploads (don't set Content-Type — browser does it)
export async function apiUpload(path, formData) {
  const token = localStorage.getItem('token') || '';

  const res = await fetch(`${BASE}${path}`, {
    method:      'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  return res;
}