import { useState, useEffect } from 'react'
import { getSpareParts, createSparePart, updateSparePart, deleteSparePart } from '../api'

function SparePartRow({ part, user, onEdit, onDelete }) {
  return (
    <tr className="parts-table-row">
      <td><strong>{part.name}</strong></td>
      <td><code className="part-sku">{part.sku || '—'}</code></td>
      <td>{part.manufacturer || '—'}</td>
      <td>{part.category || '—'}</td>
      <td>{part.material || '—'}</td>
      <td>{part.purchase_price != null ? `${part.purchase_price} ₴` : '—'}</td>
      <td>
        <span className={`qty-badge ${part.quantity <= 2 ? 'qty-low' : 'qty-ok'}`}>
          {part.quantity ?? 0}
        </span>
      </td>
      {user?.is_superuser && (
        <td className="parts-table-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(part)}>✏️</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(part.id)}>🗑️</button>
        </td>
      )}
    </tr>
  )
}

function SparePartForm({ initial, onSave, onCancel, saving }) {
  const [vals, setVals] = useState({
    name: '', sku: '', manufacturer: '', material: '', category: '', purchase_price: '', quantity: 0,
    ...initial,
  })
  function set(k, v) { setVals(p => ({ ...p, [k]: v })) }
  function num(v) { return v === '' ? '' : Number(v) }
  return (
    <div className="page-form-card">
      <h3 className="page-form-title">{initial?.id ? 'Редагувати запчастину' : 'Нова запчастина'}</h3>
      <div className="page-form-grid">
        <div className="page-form-field">
          <label>Назва *</label>
          <input className="page-input" value={vals.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Артикул (SKU)</label>
          <input className="page-input" value={vals.sku} onChange={e => set('sku', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Виробник</label>
          <input className="page-input" value={vals.manufacturer} onChange={e => set('manufacturer', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Категорія</label>
          <input className="page-input" value={vals.category} onChange={e => set('category', e.target.value)} placeholder="Гальма, ланцюг, руль..." />
        </div>
        <div className="page-form-field">
          <label>Матеріал</label>
          <input className="page-input" value={vals.material} onChange={e => set('material', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Закупівельна ціна (₴)</label>
          <input className="page-input" type="number" step="0.01" value={vals.purchase_price} onChange={e => set('purchase_price', num(e.target.value))} />
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

export default function SparePartsPage({ user, addToast, onAuth }) {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const params = {}
    if (category) params.category = category
    const res = await getSpareParts(params)
    setLoading(false)
    if (res.ok) setParts(res.data ?? [])
  }
  useEffect(() => { load() }, [category])

  if (!user) {
    return (
      <div className="page-layout">
        <div className="page-hero spareparts-hero">
          <div className="page-hero-shapes">
            <div className="page-hero-shape page-hero-shape-1" />
            <div className="page-hero-shape page-hero-shape-2" />
            <div className="page-hero-shape page-hero-shape-3" />
          </div>
          <div className="page-hero-content">
            <div className="page-hero-badge">⚙️ Запчастини</div>
            <h1 className="page-hero-title">Склад запчастин</h1>
            <p className="page-hero-sub">Авторизуйтесь для перегляду складу запчастин</p>
          </div>
        </div>
        <div className="page-content page-auth-wall">
          <div className="auth-wall-card">
            <div className="auth-wall-icon">🔐</div>
            <h2>Потрібна авторизація</h2>
            <p>Склад запчастин доступний лише для авторизованих користувачів.</p>
            <button className="btn btn-primary btn-lg" onClick={onAuth}>Увійти / Реєстрація</button>
          </div>
        </div>
      </div>
    )
  }

  const displayed = parts.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.manufacturer || '').toLowerCase().includes(search.toLowerCase())
  )

  const categories = [...new Set(parts.map(p => p.category).filter(Boolean))]

  async function handleSave(vals) {
    setSaving(true)
    const v = { ...vals }
    if (v.purchase_price === '') v.purchase_price = null
    const res = form.mode === 'add' ? await createSparePart(v) : await updateSparePart(form.data.id, v)
    setSaving(false)
    if (res.ok) { addToast(form.mode === 'add' ? 'Запчастину додано ✅' : 'Збережено ✅'); setForm(null); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  async function handleDelete(id) {
    if (!window.confirm('Видалити запчастину?')) return
    const res = await deleteSparePart(id)
    if (res.ok) { addToast('Видалено'); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  return (
    <div className="page-layout">
      <div className="page-hero spareparts-hero">
        <div className="page-hero-shapes">
          <div className="page-hero-shape page-hero-shape-1" />
          <div className="page-hero-shape page-hero-shape-2" />
          <div className="page-hero-shape page-hero-shape-3" />
        </div>
        <div className="page-hero-content">
          <div className="page-hero-badge">⚙️ Запчастини</div>
          <h1 className="page-hero-title">Склад запчастин</h1>
          <p className="page-hero-sub">Управління запчастинами для технічного обслуговування</p>
        </div>
      </div>

      <div className="page-content">
        <div className="page-toolbar">
          <div className="page-toolbar-left">
            <input
              className="page-search"
              placeholder="🔍 Пошук за назвою, артикулом..."
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
          <SparePartForm
            initial={form.mode === 'edit' ? form.data : undefined}
            onSave={handleSave}
            onCancel={() => setForm(null)}
            saving={saving}
          />
        )}

        {loading ? (
          <div className="page-loading">Завантаження...</div>
        ) : displayed.length === 0 ? (
          <div className="page-empty">⚙️ Запчастини не знайдено</div>
        ) : (
          <div className="parts-table-wrap">
            <table className="parts-table">
              <thead>
                <tr>
                  <th>Назва</th><th>Артикул</th><th>Виробник</th><th>Категорія</th>
                  <th>Матеріал</th><th>Ціна</th><th>К-сть</th>
                  {user?.is_superuser && <th>Дії</th>}
                </tr>
              </thead>
              <tbody>
                {displayed.map(p => (
                  <SparePartRow key={p.id} part={p} user={user}
                    onEdit={p => setForm({ mode: 'edit', data: p })}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
