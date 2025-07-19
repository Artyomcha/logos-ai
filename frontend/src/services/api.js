const API_URL = 'http://localhost:5000/api';

export async function register(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Ошибка регистрации');
  return res.json();
}

export async function login(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Ошибка входа');
  return res.json();
}

export async function verify2fa(data) {
  const res = await fetch(`${API_URL}/auth/verify-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Ошибка 2FA');
  const result = await res.json();
  if (result.token) localStorage.setItem('token', result.token);
  return result;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
}

export async function getProfile() {
  const token = getToken();
  const res = await fetch(`${API_URL}/user/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Ошибка загрузки профиля');
  return res.json();
} 