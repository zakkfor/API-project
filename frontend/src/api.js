// VITE_API_URL must NOT have a trailing slash, e.g. https://my-backend.up.railway.app
// When not set (FastAPI embedded mode) it defaults to '' and calls go to /api/v1/*
const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '') + '/api/v1'

function getToken() {
  return localStorage.getItem('token')
}

async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(BASE + path, { ...options, headers })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, status: res.status, data }
}

export async function login(username, password) {
  const body = new URLSearchParams({ username, password })
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, data }
}

export async function register(username, email, password) {
  return apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

export async function getMe() {
  return apiFetch('/me')
}

export async function getBicycles(params = {}) {
  const q = new URLSearchParams()
  if (params.type) q.set('type', params.type)
  if (params.available_only) q.set('available_only', 'true')
  q.set('limit', params.limit || 200)
  return apiFetch('/bicycles/?' + q.toString())
}

export async function getBicycle(id) {
  return apiFetch(`/bicycles/${id}`)
}

export async function uploadImage(file) {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE}/upload/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, data }
}

export async function createBicycle(data) {
  return apiFetch('/bicycles/', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateBicycle(id, data) {
  return apiFetch(`/bicycles/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteBicycle(id) {
  return apiFetch(`/bicycles/${id}`, { method: 'DELETE' })
}

export async function createRental(data) {
  return apiFetch('/rentals/', { method: 'POST', body: JSON.stringify(data) })
}

export async function getMyRentals() {
  return apiFetch('/rentals/my')
}

export function saveToken(token) {
  localStorage.setItem('token', token)
}

export function removeToken() {
  localStorage.removeItem('token')
}
