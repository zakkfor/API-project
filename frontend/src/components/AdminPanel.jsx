import { useState, useEffect, useCallback } from 'react'
import {
  getBicycles, createBicycle, updateBicycle, deleteBicycle,
  getTariffs, createTariff, updateTariff, deleteTariff,
  getClients, createClient, updateClient, deleteClient,
  getRoutes, createRoute, updateRoute, deleteRoute,
  getRepairs, createRepair, updateRepair, deleteRepair,
  getSpareParts, createSparePart, updateSparePart, deleteSparePart,
  getAccessories, createAccessory, updateAccessory, deleteAccessory,
  getMyRentals,
} from '../api'

const TABS = [
  { key: 'bicycles',    label: '🚲 Велосипеди' },
  { key: 'rentals',     label: '🗓 Оренда' },
  { key: 'tariffs',     label: '💰 Тарифи' },
  { key: 'clients',     label: '👤 Клієнти' },
  { key: 'repairs',     label: '🔧 Ремонти' },
  { key: 'routes',      label: '🗺 Маршрути' },
  { key: 'spare_parts', label: '⚙️ Запчастини' },
  { key: 'accessories', label: '🎒 Аксесуари' },
]

/** Parse a form input value: keep '' for empty numbers, coerce others */
function parseFieldValue(field, rawValue) {
  if (field.type === 'number') {
    return rawValue === '' ? '' : Number(rawValue)
  }
  return rawValue
}

/** Coerce select-backed boolean values ('true'/'false'/bool → bool) */
function coerceBool(value) {
  return value === true || value === 'true'
}

function FormModal({ title, fields, values, onChange, onSave, onClose, saving }) {
  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal admin-form-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">{title}</h2>
        <div className="admin-form-fields">
          {fields.map(f => (
            <div key={f.key} className="admin-form-row">
              <label className="admin-form-label">{f.label}{f.required && ' *'}</label>
              {f.type === 'select' ? (
                <select
                  className="admin-form-input"
                  value={values[f.key] ?? ''}
                  onChange={e => onChange(f.key, e.target.value)}
                >
                  {f.options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea
                  className="admin-form-input admin-form-textarea"
                  value={values[f.key] ?? ''}
                  onChange={e => onChange(f.key, e.target.value)}
                  placeholder={f.placeholder || ''}
                />
              ) : (
                <input
                  className="admin-form-input"
                  type={f.type || 'text'}
                  value={values[f.key] ?? ''}
                  onChange={e => onChange(f.key, parseFieldValue(f, e.target.value))}
                  placeholder={f.placeholder || ''}
                  step={f.step}
                  min={f.min}
                />
              )}
            </div>
          ))}
        </div>
        <div className="admin-form-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Скасувати</button>
          <button className="btn btn-primary" onClick={onSave} disabled={saving}>
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DataTable({ columns, rows, onEdit, onDelete, isAdmin }) {
  if (!rows.length) return <p className="admin-empty">Немає записів</p>
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map(c => <th key={c.key}>{c.label}</th>)}
            {isAdmin && <th>Дії</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              {columns.map(c => (
                <td key={c.key}>{c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}</td>
              ))}
              {isAdmin && (
                <td>
                  <button className="btn-icon" title="Редагувати" onClick={() => onEdit(row)}>✏️</button>
                  <button className="btn-icon btn-icon-del" title="Видалити" onClick={() => onDelete(row.id)}>🗑</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Bicycle tab ──────────────────────────────────────────────────────────────
function BicycleTab({ isAdmin, toast }) {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState(null) // null | { mode: 'add'|'edit', values }
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await getBicycles({ type: filter || undefined, limit: 500 })
    if (res.ok) setItems(res.data ?? [])
  }, [filter])

  useEffect(() => { load() }, [load])

  const FIELDS = [
    { key: 'name', label: 'Назва', required: true },
    { key: 'brand', label: 'Бренд', required: true },
    { key: 'model', label: 'Модель', required: true },
    { key: 'type', label: 'Тип', type: 'select', options: [
      {value:'mountain',label:'Гірський'},{value:'city',label:'Міський'},
      {value:'road',label:'Шосейний'},{value:'bmx',label:'BMX'},
      {value:'electric',label:'Електро'},{value:'gravel',label:'Гравел'},
    ]},
    { key: 'year', label: 'Рік', type: 'number', min: 1900 },
    { key: 'color', label: 'Колір' },
    { key: 'price_per_hour', label: 'Ціна/год (₴)', type: 'number', step: 0.5, min: 0, required: true },
    { key: 'description', label: 'Опис', type: 'textarea' },
    { key: 'is_available', label: 'Доступний', type: 'select', options: [
      {value: true, label: 'Так'}, {value: false, label: 'Ні'},
    ]},
  ]

  async function save() {
    setSaving(true)
    const v = { ...form.values }
    v.is_available = coerceBool(v.is_available)
    if (v.year === '') v.year = null
    const res = form.mode === 'add'
      ? await createBicycle(v)
      : await updateBicycle(form.values.id, v)
    setSaving(false)
    if (res.ok) { toast(form.mode === 'add' ? 'Велосипед додано' : 'Збережено'); setForm(null); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  async function del(id) {
    if (!window.confirm('Видалити велосипед?')) return
    const res = await deleteBicycle(id)
    if (res.ok) { toast('Видалено'); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  const COLS = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Назва' },
    { key: 'brand', label: 'Бренд' },
    { key: 'type', label: 'Тип' },
    { key: 'year', label: 'Рік' },
    { key: 'color', label: 'Колір' },
    { key: 'price_per_hour', label: 'Ціна/год', render: v => `${v} ₴` },
    { key: 'is_available', label: 'Доступний', render: v => v ? '✅' : '❌' },
  ]

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <div className="admin-filters">
          <select className="admin-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">Всі типи</option>
            <option value="mountain">Гірські</option>
            <option value="city">Міські</option>
            <option value="road">Шосейні</option>
            <option value="bmx">BMX</option>
            <option value="electric">Електро</option>
            <option value="gravel">Гравел</option>
          </select>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', values: { type: 'mountain', is_available: true } })}>
            + Додати велосипед
          </button>
        )}
      </div>
      <DataTable columns={COLS} rows={items} isAdmin={isAdmin}
        onEdit={row => setForm({ mode: 'edit', values: { ...row } })}
        onDelete={del}
      />
      {form && (
        <FormModal title={form.mode === 'add' ? 'Новий велосипед' : 'Редагувати велосипед'}
          fields={FIELDS} values={form.values}
          onChange={(k, v) => setForm(f => ({ ...f, values: { ...f.values, [k]: v } }))}
          onSave={save} onClose={() => setForm(null)} saving={saving}
        />
      )}
    </div>
  )
}

// ─── Rental tab ────────────────────────────────────────────────────────────────
function RentalTab({ isAdmin }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    getMyRentals().then(res => { if (res.ok) setItems(res.data ?? []) })
  }, [])

  const COLS = [
    { key: 'id', label: '#' },
    { key: 'bicycle_id', label: 'Велосипед ID' },
    { key: 'hours', label: 'Годин' },
    { key: 'total_price', label: 'Вартість', render: v => `${v} ₴` },
    { key: 'payment_method', label: 'Оплата' },
    { key: 'status', label: 'Статус' },
    { key: 'created_at', label: 'Дата', render: v => v ? new Date(v).toLocaleDateString('uk') : '—' },
  ]

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <p className="admin-hint">Ваші оренди (останні {items.length})</p>
      </div>
      <DataTable columns={COLS} rows={items} isAdmin={false} onEdit={() => {}} onDelete={() => {}} />
    </div>
  )
}

// ─── Tariff tab ────────────────────────────────────────────────────────────────
function TariffTab({ isAdmin, toast }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await getTariffs({ limit: 200 })
    if (res.ok) setItems(res.data ?? [])
  }
  useEffect(() => { load() }, [])

  const FIELDS = [
    { key: 'name', label: 'Назва', required: true },
    { key: 'description', label: 'Опис', type: 'textarea' },
    { key: 'deposit', label: 'Застава (₴)', type: 'number', step: 10, min: 0, required: true },
    { key: 'price_per_day', label: 'Ціна/день (₴)', type: 'number', step: 10, min: 0, required: true },
    { key: 'price_per_hour', label: 'Ціна/год (₴)', type: 'number', step: 1, min: 0, required: true },
    { key: 'rental_point', label: 'Точка прокату' },
  ]

  async function save() {
    setSaving(true)
    const res = form.mode === 'add'
      ? await createTariff(form.values)
      : await updateTariff(form.values.id, form.values)
    setSaving(false)
    if (res.ok) { toast(form.mode === 'add' ? 'Тариф додано' : 'Збережено'); setForm(null); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  async function del(id) {
    if (!window.confirm('Видалити тариф?')) return
    const res = await deleteTariff(id)
    if (res.ok) { toast('Видалено'); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  const COLS = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Назва' },
    { key: 'deposit', label: 'Застава', render: v => `${v} ₴` },
    { key: 'price_per_day', label: 'Ціна/день', render: v => `${v} ₴` },
    { key: 'price_per_hour', label: 'Ціна/год', render: v => `${v} ₴` },
    { key: 'rental_point', label: 'Точка прокату' },
  ]

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', values: { deposit: 0, price_per_day: 100, price_per_hour: 20 } })}>
            + Додати тариф
          </button>
        )}
      </div>
      <DataTable columns={COLS} rows={items} isAdmin={isAdmin}
        onEdit={row => setForm({ mode: 'edit', values: { ...row } })}
        onDelete={del}
      />
      {form && (
        <FormModal title={form.mode === 'add' ? 'Новий тариф' : 'Редагувати тариф'}
          fields={FIELDS} values={form.values}
          onChange={(k, v) => setForm(f => ({ ...f, values: { ...f.values, [k]: v } }))}
          onSave={save} onClose={() => setForm(null)} saving={saving}
        />
      )}
    </div>
  )
}

// ─── Client tab ────────────────────────────────────────────────────────────────
function ClientTab({ isAdmin, toast }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await getClients({ search: search || undefined, limit: 200 })
    if (res.ok) setItems(res.data ?? [])
  }, [search])

  useEffect(() => { load() }, [load])

  const FIELDS = [
    { key: 'full_name', label: 'ПІБ', required: true },
    { key: 'phone', label: 'Телефон' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'birth_date', label: 'Дата народження', type: 'date' },
    { key: 'registration_place', label: 'Місце реєстрації', type: 'textarea' },
  ]

  async function save() {
    setSaving(true)
    const v = { ...form.values }
    if (!v.birth_date) v.birth_date = null
    const res = form.mode === 'add'
      ? await createClient(v)
      : await updateClient(form.values.id, v)
    setSaving(false)
    if (res.ok) { toast(form.mode === 'add' ? 'Клієнта додано' : 'Збережено'); setForm(null); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  async function del(id) {
    if (!window.confirm('Видалити клієнта?')) return
    const res = await deleteClient(id)
    if (res.ok) { toast('Видалено'); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  const COLS = [
    { key: 'id', label: '#' },
    { key: 'full_name', label: 'ПІБ' },
    { key: 'phone', label: 'Телефон' },
    { key: 'email', label: 'Email' },
    { key: 'birth_date', label: 'Дата народження' },
    { key: 'registration_place', label: 'Місце реєстрації' },
  ]

  if (!isAdmin) return <p className="admin-empty">Тільки для адміністраторів</p>

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <div className="admin-filters">
          <input className="admin-search" placeholder="Пошук по ПІБ / email..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', values: {} })}>
          + Додати клієнта
        </button>
      </div>
      <DataTable columns={COLS} rows={items} isAdmin={isAdmin}
        onEdit={row => setForm({ mode: 'edit', values: { ...row } })}
        onDelete={del}
      />
      {form && (
        <FormModal title={form.mode === 'add' ? 'Новий клієнт' : 'Редагувати клієнта'}
          fields={FIELDS} values={form.values}
          onChange={(k, v) => setForm(f => ({ ...f, values: { ...f.values, [k]: v } }))}
          onSave={save} onClose={() => setForm(null)} saving={saving}
        />
      )}
    </div>
  )
}

// ─── Route tab ─────────────────────────────────────────────────────────────────
function RouteTab({ isAdmin, toast }) {
  const [items, setItems] = useState([])
  const [difficulty, setDifficulty] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await getRoutes({ difficulty: difficulty || undefined, limit: 200 })
    if (res.ok) setItems(res.data ?? [])
  }, [difficulty])

  useEffect(() => { load() }, [load])

  const FIELDS = [
    { key: 'name', label: 'Назва', required: true },
    { key: 'description', label: 'Опис', type: 'textarea' },
    { key: 'length_km', label: 'Довжина (км)', type: 'number', step: 0.1, min: 0 },
    { key: 'difficulty', label: 'Складність', type: 'select', options: [
      {value:'easy',label:'Легкий'},{value:'medium',label:'Середній'},
      {value:'hard',label:'Важкий'},{value:'extreme',label:'Екстремальний'},
    ]},
    { key: 'map_url', label: 'URL карти' },
  ]

  async function save() {
    setSaving(true)
    const v = { ...form.values }
    if (v.length_km === '') v.length_km = null
    const res = form.mode === 'add'
      ? await createRoute(v)
      : await updateRoute(form.values.id, v)
    setSaving(false)
    if (res.ok) { toast(form.mode === 'add' ? 'Маршрут додано' : 'Збережено'); setForm(null); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  async function del(id) {
    if (!window.confirm('Видалити маршрут?')) return
    const res = await deleteRoute(id)
    if (res.ok) { toast('Видалено'); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  const DIFF_LABELS = { easy: '🟢 Легкий', medium: '🟡 Середній', hard: '🟠 Важкий', extreme: '🔴 Екстрем' }

  const COLS = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Назва' },
    { key: 'length_km', label: 'Довжина', render: v => v ? `${v} км` : '—' },
    { key: 'difficulty', label: 'Складність', render: v => DIFF_LABELS[v] || v },
    { key: 'description', label: 'Опис', render: v => v ? v.slice(0, 60) + (v.length > 60 ? '…' : '') : '—' },
  ]

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <div className="admin-filters">
          <select className="admin-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="">Всі складності</option>
            <option value="easy">Легкий</option>
            <option value="medium">Середній</option>
            <option value="hard">Важкий</option>
            <option value="extreme">Екстремальний</option>
          </select>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', values: { difficulty: 'easy' } })}>
            + Додати маршрут
          </button>
        )}
      </div>
      <DataTable columns={COLS} rows={items} isAdmin={isAdmin}
        onEdit={row => setForm({ mode: 'edit', values: { ...row } })}
        onDelete={del}
      />
      {form && (
        <FormModal title={form.mode === 'add' ? 'Новий маршрут' : 'Редагувати маршрут'}
          fields={FIELDS} values={form.values}
          onChange={(k, v) => setForm(f => ({ ...f, values: { ...f.values, [k]: v } }))}
          onSave={save} onClose={() => setForm(null)} saving={saving}
        />
      )}
    </div>
  )
}

// ─── Repair tab ───────────────────────────────────────────────────────────────
function RepairTab({ isAdmin, toast }) {
  const [items, setItems] = useState([])
  const [bicycles, setBicycles] = useState([])
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await getRepairs({ limit: 200 })
    if (res.ok) setItems(res.data ?? [])
  }

  useEffect(() => {
    load()
    getBicycles({ limit: 200 }).then(r => { if (r.ok) setBicycles(r.data ?? []) })
  }, [])

  const FIELDS = [
    { key: 'bicycle_id', label: 'Велосипед', type: 'select',
      options: [{ value: '', label: '— обрати —' }, ...bicycles.map(b => ({ value: b.id, label: `#${b.id} ${b.name}` }))]
    },
    { key: 'date', label: 'Дата', type: 'date', required: true },
    { key: 'repair_type', label: 'Тип ремонту', required: true },
    { key: 'performer', label: 'Виконавець' },
    { key: 'warranty_days', label: 'Гарантія (днів)', type: 'number', min: 0 },
    { key: 'notes', label: 'Нотатки', type: 'textarea' },
  ]

  async function save() {
    setSaving(true)
    const v = { ...form.values, spare_part_ids: [] }
    if (v.bicycle_id === '') v.bicycle_id = null
    if (v.warranty_days === '') v.warranty_days = 0
    const res = form.mode === 'add'
      ? await createRepair(v)
      : await updateRepair(form.values.id, v)
    setSaving(false)
    if (res.ok) { toast(form.mode === 'add' ? 'Ремонт додано' : 'Збережено'); setForm(null); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  async function del(id) {
    if (!window.confirm('Видалити запис ремонту?')) return
    const res = await deleteRepair(id)
    if (res.ok) { toast('Видалено'); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  const bikeMap = Object.fromEntries(bicycles.map(b => [b.id, b.name]))

  const COLS = [
    { key: 'id', label: '#' },
    { key: 'bicycle_id', label: 'Велосипед', render: v => bikeMap[v] ? `${bikeMap[v]} (#${v})` : `#${v}` },
    { key: 'date', label: 'Дата' },
    { key: 'repair_type', label: 'Тип' },
    { key: 'performer', label: 'Виконавець' },
    { key: 'warranty_days', label: 'Гарантія', render: v => v ? `${v} дн.` : '—' },
  ]

  if (!isAdmin) return <p className="admin-empty">Тільки для адміністраторів</p>

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', values: { date: new Date().toISOString().slice(0, 10), warranty_days: 0 } })}>
          + Додати ремонт
        </button>
      </div>
      <DataTable columns={COLS} rows={items} isAdmin={isAdmin}
        onEdit={row => setForm({ mode: 'edit', values: { ...row } })}
        onDelete={del}
      />
      {form && (
        <FormModal title={form.mode === 'add' ? 'Новий ремонт' : 'Редагувати ремонт'}
          fields={FIELDS} values={form.values}
          onChange={(k, v) => setForm(f => ({ ...f, values: { ...f.values, [k]: v } }))}
          onSave={save} onClose={() => setForm(null)} saving={saving}
        />
      )}
    </div>
  )
}

// ─── SparePart tab ─────────────────────────────────────────────────────────────
function SparePartTab({ isAdmin, toast }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await getSpareParts({ search: search || undefined, category: category || undefined, limit: 200 })
    if (res.ok) setItems(res.data ?? [])
  }, [search, category])

  useEffect(() => { load() }, [load])

  const FIELDS = [
    { key: 'name', label: 'Назва', required: true },
    { key: 'article', label: 'Артикул' },
    { key: 'manufacturer', label: 'Виробник' },
    { key: 'material', label: 'Матеріал' },
    { key: 'category', label: 'Категорія' },
    { key: 'purchase_price', label: 'Ціна закупівлі (₴)', type: 'number', step: 0.01, min: 0 },
    { key: 'quantity', label: 'Кількість', type: 'number', min: 0 },
  ]

  async function save() {
    setSaving(true)
    const v = { ...form.values }
    if (v.purchase_price === '') v.purchase_price = 0
    if (v.quantity === '') v.quantity = 0
    const res = form.mode === 'add'
      ? await createSparePart(v)
      : await updateSparePart(form.values.id, v)
    setSaving(false)
    if (res.ok) { toast(form.mode === 'add' ? 'Запчастину додано' : 'Збережено'); setForm(null); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  async function del(id) {
    if (!window.confirm('Видалити запчастину?')) return
    const res = await deleteSparePart(id)
    if (res.ok) { toast('Видалено'); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  const COLS = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Назва' },
    { key: 'article', label: 'Артикул' },
    { key: 'manufacturer', label: 'Виробник' },
    { key: 'category', label: 'Категорія' },
    { key: 'purchase_price', label: 'Ціна', render: v => `${v} ₴` },
    { key: 'quantity', label: 'Кількість' },
  ]

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <div className="admin-filters">
          <input className="admin-search" placeholder="Пошук..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <input className="admin-search" placeholder="Категорія..." value={category}
            onChange={e => setCategory(e.target.value)} />
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', values: { purchase_price: 0, quantity: 0 } })}>
            + Додати запчастину
          </button>
        )}
      </div>
      <DataTable columns={COLS} rows={items} isAdmin={isAdmin}
        onEdit={row => setForm({ mode: 'edit', values: { ...row } })}
        onDelete={del}
      />
      {form && (
        <FormModal title={form.mode === 'add' ? 'Нова запчастина' : 'Редагувати запчастину'}
          fields={FIELDS} values={form.values}
          onChange={(k, v) => setForm(f => ({ ...f, values: { ...f.values, [k]: v } }))}
          onSave={save} onClose={() => setForm(null)} saving={saving}
        />
      )}
    </div>
  )
}

// ─── Accessory tab ─────────────────────────────────────────────────────────────
function AccessoryTab({ isAdmin, toast }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await getAccessories({ search: search || undefined, category: category || undefined, limit: 200 })
    if (res.ok) setItems(res.data ?? [])
  }, [search, category])

  useEffect(() => { load() }, [load])

  const FIELDS = [
    { key: 'name', label: 'Назва', required: true },
    { key: 'category', label: 'Категорія' },
    { key: 'brand', label: 'Бренд' },
    { key: 'country', label: 'Країна' },
    { key: 'warranty_months', label: 'Гарантія (міс.)', type: 'number', min: 0 },
    { key: 'sale_price', label: 'Ціна продажу (₴)', type: 'number', step: 0.01, min: 0 },
    { key: 'quantity', label: 'Кількість', type: 'number', min: 0 },
  ]

  async function save() {
    setSaving(true)
    const v = { ...form.values }
    if (v.sale_price === '') v.sale_price = 0
    if (v.quantity === '') v.quantity = 0
    if (v.warranty_months === '') v.warranty_months = null
    const res = form.mode === 'add'
      ? await createAccessory(v)
      : await updateAccessory(form.values.id, v)
    setSaving(false)
    if (res.ok) { toast(form.mode === 'add' ? 'Аксесуар додано' : 'Збережено'); setForm(null); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  async function del(id) {
    if (!window.confirm('Видалити аксесуар?')) return
    const res = await deleteAccessory(id)
    if (res.ok) { toast('Видалено'); load() }
    else toast(res.data?.detail || 'Помилка', true)
  }

  const COLS = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Назва' },
    { key: 'category', label: 'Категорія' },
    { key: 'brand', label: 'Бренд' },
    { key: 'country', label: 'Країна' },
    { key: 'warranty_months', label: 'Гарантія', render: v => v ? `${v} міс.` : '—' },
    { key: 'sale_price', label: 'Ціна', render: v => `${v} ₴` },
    { key: 'quantity', label: 'К-сть' },
  ]

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <div className="admin-filters">
          <input className="admin-search" placeholder="Пошук..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <input className="admin-search" placeholder="Категорія..." value={category}
            onChange={e => setCategory(e.target.value)} />
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setForm({ mode: 'add', values: { sale_price: 0, quantity: 0 } })}>
            + Додати аксесуар
          </button>
        )}
      </div>
      <DataTable columns={COLS} rows={items} isAdmin={isAdmin}
        onEdit={row => setForm({ mode: 'edit', values: { ...row } })}
        onDelete={del}
      />
      {form && (
        <FormModal title={form.mode === 'add' ? 'Новий аксесуар' : 'Редагувати аксесуар'}
          fields={FIELDS} values={form.values}
          onChange={(k, v) => setForm(f => ({ ...f, values: { ...f.values, [k]: v } }))}
          onSave={save} onClose={() => setForm(null)} saving={saving}
        />
      )}
    </div>
  )
}

// ─── Main AdminPanel ───────────────────────────────────────────────────────────
export default function AdminPanel({ user, onClose, addToast }) {
  const [activeTab, setActiveTab] = useState('bicycles')
  const isAdmin = user?.is_superuser ?? false

  const toast = (msg, error = false) => addToast(msg, error)

  const tabComponents = {
    bicycles:    <BicycleTab isAdmin={isAdmin} toast={toast} />,
    rentals:     <RentalTab isAdmin={isAdmin} />,
    tariffs:     <TariffTab isAdmin={isAdmin} toast={toast} />,
    clients:     <ClientTab isAdmin={isAdmin} toast={toast} />,
    repairs:     <RepairTab isAdmin={isAdmin} toast={toast} />,
    routes:      <RouteTab isAdmin={isAdmin} toast={toast} />,
    spare_parts: <SparePartTab isAdmin={isAdmin} toast={toast} />,
    accessories: <AccessoryTab isAdmin={isAdmin} toast={toast} />,
  }

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal admin-panel-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">🚲 ВелоХаус — Панель керування</h2>
        <div className="admin-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`admin-tab-btn${activeTab === t.key ? ' active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="admin-tab-content">
          {tabComponents[activeTab]}
        </div>
      </div>
    </div>
  )
}
