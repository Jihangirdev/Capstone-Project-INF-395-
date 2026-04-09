const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

// ─── AUTH ────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role }));
  return data;
}

export async function register(email, password, name, role) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, role })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role }));
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// ─── USER ────────────────────────────────────────────────

export async function getMe() {
  const res = await fetch(`${BASE_URL}/users/me`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function updateProfile(name, bio, skills) {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ name, bio, skills })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getUserStartups(userId) {
  const res = await fetch(`${BASE_URL}/users/${userId}/startups`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

// ─── STARTUPS ────────────────────────────────────────────

export async function getStartups({ category, stage, search, page = 0, size = 10 } = {}) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (stage) params.append('stage', stage);
  if (search) params.append('search', search);
  params.append('page', page);
  params.append('size', size);

  const res = await fetch(`${BASE_URL}/startups?${params}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getStartup(id) {
  const res = await fetch(`${BASE_URL}/startups/${id}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function createStartup(startup) {
  const res = await fetch(`${BASE_URL}/startups`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(startup)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

// ─── APPLICATIONS ────────────────────────────────────────

export async function applyToStartup(startupId, type, message) {
  const res = await fetch(`${BASE_URL}/startups/${startupId}/apply`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ type, message })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getStartupApplications(startupId) {
  const res = await fetch(`${BASE_URL}/startups/${startupId}/applications`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getMyApplications() {
  const res = await fetch(`${BASE_URL}/applications/my`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function updateApplicationStatus(applicationId, status) {
  const res = await fetch(`${BASE_URL}/applications/${applicationId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

// ─── FAVORITES ───────────────────────────────────────────

export async function toggleFavorite(startupId) {
  const res = await fetch(`${BASE_URL}/favorites/${startupId}`, {
    method: 'POST',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Error');
  return res.text();
}

export async function getMyFavorites() {
  const res = await fetch(`${BASE_URL}/favorites`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
