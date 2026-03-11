import { useState, useEffect } from 'react'
import { getClients, createClient, updateClient, deleteClient } from '../api'

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('uk-UA')
}

function ClientRow({ client, user, onEdit, onDelete }) {
  return (
    <tr className="parts-table-row">
      <td><strong>{client.full_name}</strong></td>
      <td>{client.phone || '—'}</td>
      <td>{client.email || '—'}</td>
      <td>{fmtDate(client.birth_date)}</td>
      <td>{client.registration_place || '—'}</td>
      {user?.is_superuser && (
        <td className="parts-table-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(client)}>✏️</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(client.id)}>🗑️</button>
        </td>
      )}
    </tr>
  )
}

function ClientForm({ initial, onSave, onCancel, saving }) {
  const [vals, setVals] = useState(() => {
    const base = { full_name: '', phone: '', email: '', birth_date: '', registration_place: '' }
    const merged = { ...base, ...initial }
    merged.birth_date = initial?.birth_date ? initial.birth_date.slice(0, 10) : ''
    return merged
  })
  function set(k, v) { setVals(p => ({ ...p, [k]: v })) }
  return (
    <div className="page-form-card">
      <h3 className="page-form-title">{initial?.id ? 'Редагувати клієнта' : 'Новий клієнт'}</h3>
      <div className="page-form-grid">
        <div className="page-form-field page-form-full">
          <label>ПІБ *</label>
          <input className="page-input" value={vals.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Іванов Іван Іванович" />
        </div>
        <div className="page-form-field">
          <label>Телефон</label>
          <input className="page-input" value={vals.phone} onChange={e => set('phone', e.target.value)} placeholder="+380..." />
        </div>
        <div className="page-form-field">
          <label>Email</label>
          <input className="page-input" type="email" value={vals.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Дата народження</label>
          <input className="page-input" type="date" value={vals.birth_date} onChange={e => set('birth_date', e.target.value)} />
        </div>
        <div className="page-form-field">
          <label>Місце реєстрації</label>
          <input className="page-input" value={vals.registration_place} onChange={e => set('registration_place', e.target.value)} />
        </div>
      </div>
      <div className="page-form-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>Скасувати</button>
        <button className="btn btn-primary" onClick={() => onSave(vals)} disabled={saving}>{saving ? 'Збереження...' : 'Зберегти'}</button>
      </div>
    </div>
  )
}

export default function ClientsPage({ user, addToast, onAuth }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!user) return
    setLoading(true)
    const params = search ? { search } : {}
    const res = await getClients(params)
    setLoading(false)
    if (res.ok) setClients(res.data ?? [])
  }
  useEffect(() => { load() }, [user])

  if (!user) {
    return (
      <div className="page-layout">
        <div className="page-hero clients-hero">
          <div className="page-hero-content">
            <div className="page-hero-badge">👥 Клієнти</div>
            <h1 className="page-hero-title">База клієнтів</h1>
            <p className="page-hero-sub">Авторизуйтесь для доступу до бази клієнтів</p>
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

  if (!user.is_superuser) {
    return (
      <div className="page-layout">
        <div className="page-hero clients-hero">
          <div className="page-hero-content">
            <div className="page-hero-badge">👥 Клієнти</div>
            <h1 className="page-hero-title">База клієнтів</h1>
          </div>
        </div>
        <div className="page-content page-auth-wall">
          <div className="auth-wall-card">
            <div className="auth-wall-icon">🚫</div>
            <h2>Доступ тільки для адміністраторів</h2>
            <p>База клієнтів доступна лише адміністраторам системи.</p>
          </div>
        </div>
      </div>
    )
  }

  const displayed = clients.filter(c =>
    !search ||
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  )

  async function handleSave(vals) {
    setSaving(true)
    const v = { ...vals }
    if (!v.birth_date) v.birth_date = null
    const res = form.mode === 'add' ? await createClient(v) : await updateClient(form.data.id, v)
    setSaving(false)
    if (res.ok) { addToast(form.mode === 'add' ? 'Клієнта додано ✅' : 'Збережено ✅'); setForm(null); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  async function handleDelete(id) {
    if (!window.confirm('Видалити клієнта?')) return
    const res = await deleteClient(id)
    if (res.ok) { addToast('Видалено'); load() }
    else addToast(res.data?.detail || 'Помилка', true)
  }

  return (
    <div className="page-layout">
      <div className="page-hero clients-hero">
        <div className="page-hero-content">
          <div className="page-hero-badge">👥 Клієнти</div>
          <h1 className="page-hero-title">База клієнтів</h1>
          <p className="page-hero-sub">Управління клієнтами велопрокату</p>
        </div>
      </div>

      <div className="page-content">
        <div className="page-toolbar">
          <div className="page-toolbar-left">
            <input
              className="page-search"
              placeholder="🔍 Пошук за ім'ям, телефоном, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load()}
            />
            <button className="btn btn-secondary" onClick={load}>Шукати</button>
          </div>
          {!form && (
            <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', data: {} })}>+ Новий клієнт</button>
          )}
        </div>

        {form && (
          <ClientForm
            initial={form.mode === 'edit' ? form.data : undefined}
            onSave={handleSave}
            onCancel={() => setForm(null)}
            saving={saving}
          />
        )}

        {loading ? (
          <div className="page-loading">Завантаження...</div>
        ) : displayed.length === 0 ? (
          <div className="page-empty">👥 Клієнтів не знайдено</div>
        ) : (
          <div className="parts-table-wrap">
            <table className="parts-table">
              <thead>
                <tr>
                  <th>ПІБ</th><th>Телефон</th><th>Email</th><th>Дата народження</th>
                  <th>Місце реєстрації</th>
                  {user?.is_superuser && <th>Дії</th>}
                </tr>
              </thead>
              <tbody>
                {displayed.map(c => (
                  <ClientRow key={c.id} client={c} user={user}
                    onEdit={c => setForm({ mode: 'edit', data: c })}
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
