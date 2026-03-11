import { useState, useEffect } from 'react'
import { getRepairs, createRepair, updateRepair, deleteRepair } from '../api'

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('uk-UA')
}

function RepairCard({ repair, user, onEdit, onDelete }) {
  return (
    <div className="page-card repair-card">
      <div className="repair-card-header">
        <span className="repair-type-badge">🔧 {repair.repair_type || 'Ремонт'}</span>
        {repair.warranty_until && (
          <span className="repair-warranty">🛡️ до {fmtDate(repair.warranty_until)}</span>
        )}
      </div>
      <div className="repair-card-meta">
        <div className="repair-meta-row">
          <span>🚲 Велосипед:</span>
          <strong>#{repair.bicycle_id}</strong>
        </div>
        {repair.repair_date && (
          <div className="repair-meta-row">
            <span>📅 Дата:</span>
            <strong>{fmtDate(repair.repair_date)}</strong>
          </div>
        )}
        {repair.technician && (
          <div className="repair-meta-row">
            <span>👨‍🔧 Технік:</span>
            <strong>{repair.technician}</strong>
          </div>
        )}
      </div>
      {repair.description && (
        <p className="repair-description">{repair.description}</p>
      )}
      {user?.is_superuser && (
        <div className="page-card-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(repair)}>✏️ Редагувати</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(repair.id)}>🗑️ Видалити</button>
        </div>
      )}
    </div>
  )
}

function RepairForm({ initial, onSave, onCancel, saving }) {
  const [vals, setVals] = useState(() => {
    const base = { bicycle_id: '', repair_date: '', repair_type: '', technician: '', warranty_until: '', description: '' }
    const merged = { ...base, ...initial }
    merged.repair_date = initial?.repair_date ? initial.repair_date.slice(0, 10) : ''
    merged.warranty_until = initial?.warranty_until ? initial.warranty_until.slice(0, 10) : ''
    return merged
  })
  function set(k, v) { setVals(p => ({ ...p, [k]: v })) }
  return (
    <div className="page-form-card">
      <h3 className="page-form-title">{initial?.id ? 'Редагувати ремонт' : 'Новий ремонт'}</h3>
      <div className="page-form-grid">
        <div className="page-form-field">
          <label>ID велосипеда *</label>
          <input className="page-input" type="number" value={vals.bicycle_id} onChange={e => set('bicycle_id', Number(e.target.value))} />
        </div>
        <div className="page-form-field">
          <label>Тип ремонту</label>
          <input className="page-input" value={vals.repair_type} onChange={e => set('repair_type', e.target.value)} placeholder="Заміна гальм, мастило..." />
        </div>
        <div className="page-form-field">
          <label>Дата ремонту</label>
          <input className="page-input" type="date" value={vals.repair_date} onChange={e => set('repair_date', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Технік</label>
          <input className="page-input" value={vals.technician} onChange={e => set('technician', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Гарантія до</label>
          <input className="page-input" type="date" value={vals.warranty_until} onChange={e => set('warranty_until', e.target.value)} />
        </div>
        <div className="page-form-field page-form-full">
          <label>Опис робіт</label>
          <textarea className="page-input page-textarea" value={vals.description} onChange={e => set('description', e.target.value)} />
        </div>
      </div>
      <div className="page-form-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>Скасувати</button>
        <button className="btn btn-primary" onClick={() => onSave(vals)} disabled={saving}>{saving ? 'Збереження...' : 'Зберегти'}</button>
      </div>
    </div>
  )
}

export default function RepairsPage({ user, addToast, onAuth }) {
  const [repairs, setRepairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!user) return
    setLoading(true)
    const res = await getRepairs()
    setLoading(false)
    if (res.ok) setRepairs(res.data ?? [])
  }
  useEffect(() => { load() }, [user])

  if (!user) {
    return (
      <div className="page-layout">
        <div className="page-hero repairs-hero">
          <div className="page-hero-shapes">
            <div className="page-hero-shape page-hero-shape-1" />
            <div className="page-hero-shape page-hero-shape-2" />
            <div className="page-hero-shape page-hero-shape-3" />
          </div>
          <div className="page-hero-content">
            <div className="page-hero-badge">🔧 Ремонти</div>
            <h1 className="page-hero-title">Ремонт велосипедів</h1>
            <p className="page-hero-sub">Авторизуйтесь для перегляду записів ремонту</p>
          </div>
        </div>
        <div className="page-content page-auth-wall">
          <div className="auth-wall-card">
            <div className="auth-wall-icon">🔐</div>
            <h2>Потрібна авторизація</h2>
            <button className="btn btn-primary btn-lg" onClick={onAuth}>Увійти / Реєстрація</button>
          </div>
        </div>
      </div>
    )
  }

  const displayed = repairs.filter(r =>
    !search ||
    (r.technician || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.repair_type || '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(vals) {
    setSaving(true)
    const v = { ...vals }
    if (!v.repair_date) v.repair_date = null
    if (!v.warranty_until) v.warranty_until = null
    const res = form.mode === 'add' ? await createRepair(v) : await updateRepair(form.data.id, v)
    setSaving(false)
    if (res.ok) { addToast(form.mode === 'add' ? 'Ремонт додано ✅' : 'Збережено ✅'); setForm(null); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  async function handleDelete(id) {
    if (!window.confirm('Видалити запис ремонту?')) return
    const res = await deleteRepair(id)
    if (res.ok) { addToast('Видалено'); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  return (
    <div className="page-layout">
      <div className="page-hero repairs-hero">
        <div className="page-hero-shapes">
          <div className="page-hero-shape page-hero-shape-1" />
          <div className="page-hero-shape page-hero-shape-2" />
          <div className="page-hero-shape page-hero-shape-3" />
        </div>
        <div className="page-hero-content">
          <div className="page-hero-badge">🔧 Ремонти</div>
          <h1 className="page-hero-title">Ремонт велосипедів</h1>
          <p className="page-hero-sub">Журнал технічного обслуговування та ремонтів</p>
        </div>
      </div>

      <div className="page-content">
        <div className="page-toolbar">
          <input
            className="page-search"
            placeholder="🔍 Пошук за технікм, типом ремонту..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {user?.is_superuser && !form && (
            <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', data: {} })}>+ Додати</button>
          )}
        </div>

        {form && (
          <RepairForm
            initial={form.mode === 'edit' ? form.data : undefined}
            onSave={handleSave}
            onCancel={() => setForm(null)}
            saving={saving}
          />
        )}

        {loading ? (
          <div className="page-loading">Завантаження...</div>
        ) : displayed.length === 0 ? (
          <div className="page-empty">🔧 Записів ремонту не знайдено</div>
        ) : (
          <div className="page-grid-3">
            {displayed.map(r => (
              <RepairCard key={r.id} repair={r} user={user}
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
