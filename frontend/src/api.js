const BASE = '/api/v1'

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
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, data }
}

export async function register(username, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

export async function getMe() {
  return apiFetch('/users/me')
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

export async function createBicycle(data) {
  return apiFetch('/bicycles/', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateBicycle(id, data) {
  return apiFetch(`/bicycles/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteBicycle(id) {
  return apiFetch(`/bicycles/${id}`, { method: 'DELETE' })
}

export function saveToken(token) {
  localStorage.setItem('token', token)
}

export function removeToken() {
  localStorage.removeItem('token')
}
