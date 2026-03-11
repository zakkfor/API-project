import { useState, useEffect } from 'react'
import { getRoutes, createRoute, updateRoute, deleteRoute } from '../api'

const DIFFICULTY_LABELS = {
  easy: { label: '🟢 Легкий', cls: 'badge-easy' },
  medium: { label: '🟡 Середній', cls: 'badge-medium' },
  hard: { label: '🔴 Важкий', cls: 'badge-hard' },
}

function RouteCard({ route, user, onEdit, onDelete }) {
  const diff = DIFFICULTY_LABELS[route.difficulty] || { label: route.difficulty, cls: '' }
  return (
    <div className="page-card route-card">
      <div className="route-card-header">
        <h3 className="route-card-title">{route.name}</h3>
        <span className={`route-badge ${diff.cls}`}>{diff.label}</span>
      </div>
      {route.description && <p className="route-card-desc">{route.description}</p>}
      <div className="route-card-meta">
        {route.length_km && (
          <span className="route-meta-item">📏 {route.length_km} км</span>
        )}
        {route.map_url && (
          <a href={route.map_url} target="_blank" rel="noopener noreferrer" className="route-meta-item route-map-link">
            🗺️ Карта
          </a>
        )}
      </div>
      {user?.is_superuser && (
        <div className="page-card-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(route)}>✏️ Редагувати</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(route.id)}>🗑️ Видалити</button>
        </div>
      )}
    </div>
  )
}

function RouteForm({ initial, onSave, onCancel, saving }) {
  const [vals, setVals] = useState({
    name: '', description: '', map_url: '', length_km: '', difficulty: 'easy',
    ...initial,
  })
  function set(k, v) { setVals(p => ({ ...p, [k]: v })) }
  return (
    <div className="page-form-card">
      <h3 className="page-form-title">{initial?.id ? 'Редагувати маршрут' : 'Новий маршрут'}</h3>
      <div className="page-form-grid">
        <div className="page-form-field">
          <label>Назва *</label>
          <input className="page-input" value={vals.name} onChange={e => set('name', e.target.value)} placeholder="Назва маршруту" />
        </div>
        <div className="page-form-field">
          <label>Складність</label>
          <select className="page-input" value={vals.difficulty} onChange={e => set('difficulty', e.target.value)}>
            <option value="easy">🟢 Легкий</option>
            <option value="medium">🟡 Середній</option>
            <option value="hard">🔴 Важкий</option>
          </select>
        </div>
        <div className="page-form-field">
          <label>Довжина (км)</label>
          <input className="page-input" type="number" step="0.1" value={vals.length_km} onChange={e => set('length_km', e.target.value === '' ? '' : Number(e.target.value))} placeholder="12.5" />
        </div>
        <div className="page-form-field">
          <label>Посилання на карту</label>
          <input className="page-input" value={vals.map_url} onChange={e => set('map_url', e.target.value)} placeholder="https://maps.google.com/..." />
        </div>
        <div className="page-form-field page-form-full">
          <label>Опис</label>
          <textarea className="page-input page-textarea" value={vals.description} onChange={e => set('description', e.target.value)} placeholder="Опис маршруту..." />
        </div>
      </div>
      <div className="page-form-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>Скасувати</button>
        <button className="btn btn-primary" onClick={() => onSave(vals)} disabled={saving}>{saving ? 'Збереження...' : 'Зберегти'}</button>
      </div>
    </div>
  )
}

export default function RoutesPage({ user, addToast }) {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null) // null | { mode: 'add'|'edit', data: {} }
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const params = {}
    if (filter) params.difficulty = filter
    const res = await getRoutes(params)
    setLoading(false)
    if (res.ok) setRoutes(res.data ?? [])
  }

  useEffect(() => { load() }, [filter])

  const displayed = routes.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(vals) {
    setSaving(true)
    const v = { ...vals }
    if (v.length_km === '') v.length_km = null
    const res = form.mode === 'add'
      ? await createRoute(v)
      : await updateRoute(form.data.id, v)
    setSaving(false)
    if (res.ok) { addToast(form.mode === 'add' ? 'Маршрут додано ✅' : 'Збережено ✅'); setForm(null); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  async function handleDelete(id) {
    if (!window.confirm('Видалити маршрут?')) return
    const res = await deleteRoute(id)
    if (res.ok) { addToast('Видалено'); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  return (
    <div className="page-layout">
      <div className="page-hero routes-hero">
        <div className="page-hero-shapes">
          <div className="page-hero-shape page-hero-shape-1" />
          <div className="page-hero-shape page-hero-shape-2" />
          <div className="page-hero-shape page-hero-shape-3" />
        </div>
        <div className="page-hero-content">
          <div className="page-hero-badge">🗺️ Маршрути</div>
          <h1 className="page-hero-title">Велосипедні маршрути</h1>
          <p className="page-hero-sub">Досліджуйте найкращі траси Вінниці та околиць</p>
        </div>
      </div>

      <div className="page-content">
        <div className="page-toolbar">
          <div className="page-toolbar-left">
            <input
              className="page-search"
              placeholder="🔍 Пошук маршрутів..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="page-filter-tabs">
              {[['', 'Всі'], ['easy', '🟢 Легкі'], ['medium', '🟡 Середні'], ['hard', '🔴 Важкі']].map(([val, lab]) => (
                <button key={val} className={`filter-tab${filter === val ? ' active' : ''}`} onClick={() => setFilter(val)}>{lab}</button>
              ))}
            </div>
          </div>
          {user?.is_superuser && !form && (
            <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', data: {} })}>
              + Додати маршрут
            </button>
          )}
        </div>

        {form && (
          <RouteForm
            initial={form.mode === 'edit' ? form.data : undefined}
            onSave={handleSave}
            onCancel={() => setForm(null)}
            saving={saving}
          />
        )}

        {loading ? (
          <div className="page-loading">Завантаження...</div>
        ) : displayed.length === 0 ? (
          <div className="page-empty">🗺️ Маршрути не знайдено</div>
        ) : (
          <div className="page-grid-3">
            {displayed.map(r => (
              <RouteCard
                key={r.id}
                route={r}
                user={user}
                onEdit={r => setForm({ mode: 'edit', data: r })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
