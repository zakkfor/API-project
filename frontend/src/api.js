
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

// ── Tariffs ──────────────────────────────────────────────
export async function getTariffs(params = {}) {
  const q = new URLSearchParams()
  if (params.rental_point) q.set('rental_point', params.rental_point)
  q.set('limit', params.limit || 200)
  return apiFetch('/tariffs/?' + q.toString())
}
export async function createTariff(data) {
  return apiFetch('/tariffs/', { method: 'POST', body: JSON.stringify(data) })
}
export async function updateTariff(id, data) {
  return apiFetch(`/tariffs/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}
export async function deleteTariff(id) {
  return apiFetch(`/tariffs/${id}`, { method: 'DELETE' })
}

// ── Clients ──────────────────────────────────────────────
export async function getClients(params = {}) {
  const q = new URLSearchParams()
  if (params.search) q.set('search', params.search)
  q.set('limit', params.limit || 200)
  return apiFetch('/clients/?' + q.toString())
}
export async function createClient(data) {
  return apiFetch('/clients/', { method: 'POST', body: JSON.stringify(data) })
}
export async function updateClient(id, data) {
  return apiFetch(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}
export async function deleteClient(id) {
  return apiFetch(`/clients/${id}`, { method: 'DELETE' })
}

// ── Routes ────────────────────────────────────────────────
export async function getRoutes(params = {}) {
  const q = new URLSearchParams()
  if (params.difficulty) q.set('difficulty', params.difficulty)
  if (params.max_length_km) q.set('max_length_km', params.max_length_km)
  q.set('limit', params.limit || 200)
  return apiFetch('/routes/?' + q.toString())
}
export async function createRoute(data) {
  return apiFetch('/routes/', { method: 'POST', body: JSON.stringify(data) })
}
export async function updateRoute(id, data) {
  return apiFetch(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}
export async function deleteRoute(id) {
  return apiFetch(`/routes/${id}`, { method: 'DELETE' })
}

// ── Repairs ───────────────────────────────────────────────
export async function getRepairs(params = {}) {
  const q = new URLSearchParams()
  if (params.bicycle_id) q.set('bicycle_id', params.bicycle_id)
  if (params.repair_type) q.set('repair_type', params.repair_type)
  q.set('limit', params.limit || 200)
  return apiFetch('/repairs/?' + q.toString())
}
export async function createRepair(data) {
  return apiFetch('/repairs/', { method: 'POST', body: JSON.stringify(data) })
}
export async function updateRepair(id, data) {
  return apiFetch(`/repairs/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}
export async function deleteRepair(id) {
  return apiFetch(`/repairs/${id}`, { method: 'DELETE' })
}

// ── Spare parts ───────────────────────────────────────────
export async function getSpareParts(params = {}) {
  const q = new URLSearchParams()
  if (params.category) q.set('category', params.category)
  if (params.manufacturer) q.set('manufacturer', params.manufacturer)
  if (params.search) q.set('search', params.search)
  q.set('limit', params.limit || 200)
  return apiFetch('/spare-parts/?' + q.toString())
}
export async function createSparePart(data) {
  return apiFetch('/spare-parts/', { method: 'POST', body: JSON.stringify(data) })
}
export async function updateSparePart(id, data) {
  return apiFetch(`/spare-parts/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}
export async function deleteSparePart(id) {
  return apiFetch(`/spare-parts/${id}`, { method: 'DELETE' })
}

// ── Accessories ───────────────────────────────────────────
export async function getAccessories(params = {}) {
  const q = new URLSearchParams()
  if (params.category) q.set('category', params.category)
  if (params.brand) q.set('brand', params.brand)
  if (params.search) q.set('search', params.search)
  q.set('limit', params.limit || 200)
  return apiFetch('/accessories/?' + q.toString())
}
export async function createAccessory(data) {
  return apiFetch('/accessories/', { method: 'POST', body: JSON.stringify(data) })
}
export async function updateAccessory(id, data) {
  return apiFetch(`/accessories/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}
export async function deleteAccessory(id) {
  return apiFetch(`/accessories/${id}`, { method: 'DELETE' })
}
