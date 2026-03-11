import { useState, useEffect } from 'react'
import { getAccessories, createAccessory, updateAccessory, deleteAccessory } from '../api'

function AccessoryCard({ item, user, onEdit, onDelete }) {
  return (
    <div className="page-card accessory-card">
      <div className="accessory-card-header">
        <span className="accessory-category-badge">🎒 {item.category || 'Аксесуар'}</span>
        {item.quantity != null && item.quantity <= 3 && (
          <span className="accessory-low-stock">⚠️ Мало</span>
        )}
      </div>
      <h3 className="accessory-card-title">{item.name}</h3>
      <div className="accessory-card-meta">
        {item.brand && <span className="accessory-meta-item">🏷️ {item.brand}</span>}
        {item.country && <span className="accessory-meta-item">🌍 {item.country}</span>}
        {item.warranty_months != null && (
          <span className="accessory-meta-item">🛡️ Гарантія: {item.warranty_months} міс.</span>
        )}
      </div>
      <div className="accessory-card-footer">
        {item.sale_price != null && (
          <div className="accessory-price">{item.sale_price} ₴</div>
        )}
        {item.quantity != null && (
          <div className="accessory-quantity">На складі: {item.quantity} шт.</div>
        )}
      </div>
      {user?.is_superuser && (
        <div className="page-card-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(item)}>✏️</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(item.id)}>🗑️</button>
        </div>
      )}
    </div>
  )
}

function AccessoryForm({ initial, onSave, onCancel, saving }) {
  const [vals, setVals] = useState({
    name: '', category: '', brand: '', country: '', warranty_months: '', sale_price: '', quantity: 0,
    ...initial,
  })
  function set(k, v) { setVals(p => ({ ...p, [k]: v })) }
  function num(v) { return v === '' ? '' : Number(v) }
  return (
    <div className="page-form-card">
      <h3 className="page-form-title">{initial?.id ? 'Редагувати аксесуар' : 'Новий аксесуар'}</h3>
      <div className="page-form-grid">
        <div className="page-form-field">
          <label>Назва *</label>
          <input className="page-input" value={vals.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Категорія</label>
          <input className="page-input" value={vals.category} onChange={e => set('category', e.target.value)} placeholder="Шолом, замок, ліхтар..." />
        </div>
        <div className="page-form-field">
          <label>Бренд</label>
          <input className="page-input" value={vals.brand} onChange={e => set('brand', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Країна виробника</label>
          <input className="page-input" value={vals.country} onChange={e => set('country', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Ціна продажу (₴)</label>
          <input className="page-input" type="number" step="0.01" value={vals.sale_price} onChange={e => set('sale_price', num(e.target.value))} />
        </div>
        <div className="page-form-field">
          <label>Гарантія (міс.)</label>
          <input className="page-input" type="number" value={vals.warranty_months} onChange={e => set('warranty_months', num(e.target.value))} />
        </div>
        <div className="page-form-field">
          <label>Кількість</label>
          <input className="page-input" type="number" value={vals.quantity} onChange={e => set('quantity', num(e.target.value))} />
        </div>
      </div>
      <div className="page-form-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>Скасувати</button>
        <button className="btn btn-primary" onClick={() => onSave(vals)} disabled={saving}>{saving ? 'Збереження...' : 'Зберегти'}</button>
      </div>
    </div>
  )
}

export default function AccessoriesPage({ user, addToast }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const params = {}
    if (category) params.category = category
    if (search) params.search = search
    const res = await getAccessories(params)
    setLoading(false)
    if (res.ok) setItems(res.data ?? [])
  }
  useEffect(() => { load() }, [category])

  const displayed = items.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.brand || '').toLowerCase().includes(search.toLowerCase())
  )

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))]

  async function handleSave(vals) {
    setSaving(true)
    const v = { ...vals }
    if (v.sale_price === '') v.sale_price = null
    if (v.warranty_months === '') v.warranty_months = null
    const res = form.mode === 'add' ? await createAccessory(v) : await updateAccessory(form.data.id, v)
    setSaving(false)
    if (res.ok) { addToast(form.mode === 'add' ? 'Аксесуар додано ✅' : 'Збережено ✅'); setForm(null); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  async function handleDelete(id) {
    if (!window.confirm('Видалити аксесуар?')) return
    const res = await deleteAccessory(id)
    if (res.ok) { addToast('Видалено'); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  return (
    <div className="page-layout">
      <div className="page-hero accessories-hero">
        <div className="page-hero-content">
          <div className="page-hero-badge">🎒 Аксесуари</div>
          <h1 className="page-hero-title">Аксесуари для велосипеда</h1>
          <p className="page-hero-sub">Шоломи, замки, ліхтарі та все необхідне для поїздки</p>
        </div>
      </div>

      <div className="page-content">
        <div className="page-toolbar">
          <div className="page-toolbar-left">
            <input
              className="page-search"
              placeholder="🔍 Пошук аксесуарів..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {categories.length > 0 && (
              <div className="page-filter-tabs">
                <button className={`filter-tab${!category ? ' active' : ''}`} onClick={() => setCategory('')}>Всі</button>
                {categories.map(c => (
                  <button key={c} className={`filter-tab${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
                ))}
              </div>
            )}
          </div>
          {user?.is_superuser && !form && (
            <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', data: {} })}>+ Додати</button>
          )}
        </div>

        {form && (
          <AccessoryForm
            initial={form.mode === 'edit' ? form.data : undefined}
            onSave={handleSave}
            onCancel={() => setForm(null)}
            saving={saving}
          />
        )}

        {loading ? (
          <div className="page-loading">Завантаження...</div>
        ) : displayed.length === 0 ? (
          <div className="page-empty">🎒 Аксесуари не знайдено</div>
        ) : (
          <div className="page-grid-4">
            {displayed.map(i => (
              <AccessoryCard key={i.id} item={i} user={user}
                onEdit={i => setForm({ mode: 'edit', data: i })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
