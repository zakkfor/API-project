import { useState, useEffect } from 'react'
import { getTariffs, createTariff, updateTariff, deleteTariff } from '../api'

function TariffCard({ tariff, user, onEdit, onDelete }) {
  return (
    <div className="page-card tariff-card">
      <div className="tariff-card-header">
        <h3 className="tariff-card-title">{tariff.name}</h3>
        {tariff.rental_point && <span className="tariff-point-badge">📍 {tariff.rental_point}</span>}
      </div>
      {tariff.description && <p className="tariff-card-desc">{tariff.description}</p>}
      <div className="tariff-pricing">
        {tariff.price_per_hour != null && (
          <div className="tariff-price-item">
            <span className="tariff-price-value">{tariff.price_per_hour} ₴</span>
            <span className="tariff-price-label">/ година</span>
          </div>
        )}
        {tariff.price_per_day != null && (
          <div className="tariff-price-item">
            <span className="tariff-price-value">{tariff.price_per_day} ₴</span>
            <span className="tariff-price-label">/ день</span>
          </div>
        )}
      </div>
      {tariff.deposit != null && (
        <div className="tariff-deposit">💰 Застава: {tariff.deposit} ₴</div>
      )}
      {user?.is_superuser && (
        <div className="page-card-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(tariff)}>✏️</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(tariff.id)}>🗑️</button>
        </div>
      )}
    </div>
  )
}

function TariffForm({ initial, onSave, onCancel, saving }) {
  const [vals, setVals] = useState({
    name: '', description: '', deposit: '', price_per_day: '', price_per_hour: '', rental_point: '',
    ...initial,
  })
  function set(k, v) { setVals(p => ({ ...p, [k]: v })) }
  function num(v) { return v === '' ? '' : Number(v) }
  return (
    <div className="page-form-card">
      <h3 className="page-form-title">{initial?.id ? 'Редагувати тариф' : 'Новий тариф'}</h3>
      <div className="page-form-grid">
        <div className="page-form-field">
          <label>Назва *</label>
          <input className="page-input" value={vals.name} onChange={e => set('name', e.target.value)} placeholder="Стандарт" />
        </div>
        <div className="page-form-field">
          <label>Точка прокату</label>
          <input className="page-input" value={vals.rental_point} onChange={e => set('rental_point', e.target.value)} placeholder="Центр міста" />
        </div>
        <div className="page-form-field">
          <label>Ціна / год (₴)</label>
          <input className="page-input" type="number" step="0.01" value={vals.price_per_hour} onChange={e => set('price_per_hour', num(e.target.value))} placeholder="35" />
        </div>
        <div className="page-form-field">
          <label>Ціна / день (₴)</label>
          <input className="page-input" type="number" step="0.01" value={vals.price_per_day} onChange={e => set('price_per_day', num(e.target.value))} placeholder="250" />
        </div>
        <div className="page-form-field">
          <label>Застава (₴)</label>
          <input className="page-input" type="number" step="0.01" value={vals.deposit} onChange={e => set('deposit', num(e.target.value))} placeholder="500" />
        </div>
        <div className="page-form-field page-form-full">
          <label>Опис</label>
          <textarea className="page-input page-textarea" value={vals.description} onChange={e => set('description', e.target.value)} placeholder="Опис тарифу..." />
        </div>
      </div>
      <div className="page-form-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>Скасувати</button>
        <button className="btn btn-primary" onClick={() => onSave(vals)} disabled={saving}>{saving ? 'Збереження...' : 'Зберегти'}</button>
      </div>
    </div>
  )
}

export default function TariffsPage({ user, addToast }) {
  const [tariffs, setTariffs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    const res = await getTariffs()
    setLoading(false)
    if (res.ok) setTariffs(res.data ?? [])
  }
  useEffect(() => { load() }, [])

  const displayed = tariffs.filter(tariff =>
    !search || tariff.name.toLowerCase().includes(search.toLowerCase()) ||
    (tariff.rental_point || '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(vals) {
    setSaving(true)
    const tariffData = { ...vals }
    if (tariffData.price_per_hour === '') tariffData.price_per_hour = null
    if (tariffData.price_per_day === '') tariffData.price_per_day = null
    if (tariffData.deposit === '') tariffData.deposit = null
    const res = form.mode === 'add' ? await createTariff(tariffData) : await updateTariff(form.data.id, tariffData)
    setSaving(false)
    if (res.ok) { addToast(form.mode === 'add' ? 'Тариф додано ✅' : 'Збережено ✅'); setForm(null); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  async function handleDelete(id) {
    if (!window.confirm('Видалити тариф?')) return
    const res = await deleteTariff(id)
    if (res.ok) { addToast('Видалено'); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  return (
    <div className="page-layout">
      <div className="page-hero tariffs-hero">
        <div className="page-hero-content">
          <div className="page-hero-badge">💰 Тарифи</div>
          <h1 className="page-hero-title">Ціни та тарифи</h1>
          <p className="page-hero-sub">Прозоре ціноутворення — без прихованих платежів</p>
        </div>
      </div>

      <div className="page-content">
        <div className="page-toolbar">
          <input
            className="page-search"
            placeholder="🔍 Пошук тарифів..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {user?.is_superuser && !form && (
            <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', data: {} })}>
              + Додати тариф
            </button>
          )}
        </div>

        {form && (
          <TariffForm
            initial={form.mode === 'edit' ? form.data : undefined}
            onSave={handleSave}
            onCancel={() => setForm(null)}
            saving={saving}
          />
        )}

        {loading ? (
          <div className="page-loading">Завантаження...</div>
        ) : displayed.length === 0 ? (
          <div className="page-empty">💰 Тарифи не знайдено</div>
        ) : (
          <div className="page-grid-3">
            {displayed.map(tariff => (
              <TariffCard key={tariff.id} tariff={tariff} user={user}
                onEdit={tariff => setForm({ mode: 'edit', data: tariff })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
