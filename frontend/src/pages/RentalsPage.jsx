import { useState, useEffect } from 'react'
import { getMyRentals } from '../api'

const STATUS_MAP = {
  active: { label: 'Активна', cls: 'status-active' },
  completed: { label: 'Завершена', cls: 'status-done' },
  cancelled: { label: 'Скасована', cls: 'status-cancelled' },
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function RentalCard({ rental }) {
  const st = STATUS_MAP[rental.status] || { label: rental.status, cls: '' }
  return (
    <div className="page-card rental-card">
      <div className="rental-card-header">
        <span className="rental-card-bike">🚲 Велосипед #{rental.bicycle_id}</span>
        <span className={`rental-status ${st.cls}`}>{st.label}</span>
      </div>
      <div className="rental-card-dates">
        <div className="rental-date-row">
          <span className="rental-date-label">Початок:</span>
          <span>{fmtDate(rental.start_time)}</span>
        </div>
        <div className="rental-date-row">
          <span className="rental-date-label">Кінець:</span>
          <span>{fmtDate(rental.end_time)}</span>
        </div>
      </div>
      <div className="rental-card-meta">
        {rental.total_cost != null && (
          <div className="rental-meta-item">
            <span className="rental-meta-label">Вартість:</span>
            <span className="rental-meta-value">{rental.total_cost} ₴</span>
          </div>
        )}
        {rental.payment_method && (
          <div className="rental-meta-item">
            <span className="rental-meta-label">Оплата:</span>
            <span className="rental-meta-value">{rental.payment_method}</span>
          </div>
        )}
        {rental.tariff_id && (
          <div className="rental-meta-item">
            <span className="rental-meta-label">Тариф:</span>
            <span className="rental-meta-value">#{rental.tariff_id}</span>
          </div>
        )}
        {rental.route_id && (
          <div className="rental-meta-item">
            <span className="rental-meta-label">Маршрут:</span>
            <span className="rental-meta-value">#{rental.route_id}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RentalsPage({ user, onAuth }) {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  async function load() {
    if (!user) return
    setLoading(true)
    const res = await getMyRentals()
    setLoading(false)
    if (res.ok) setRentals(res.data ?? [])
  }
  useEffect(() => { load() }, [user])

  if (!user) {
    return (
      <div className="page-layout">
        <div className="page-hero rentals-hero">
          <div className="page-hero-shapes">
            <div className="page-hero-shape page-hero-shape-1" />
            <div className="page-hero-shape page-hero-shape-2" />
            <div className="page-hero-shape page-hero-shape-3" />
          </div>
          <div className="page-hero-content">
            <div className="page-hero-badge">🗓️ Оренди</div>
            <h1 className="page-hero-title">Мої оренди</h1>
            <p className="page-hero-sub">Увійдіть, щоб переглянути свою історію оренд</p>
          </div>
        </div>
        <div className="page-content page-auth-wall">
          <div className="auth-wall-card">
            <div className="auth-wall-icon">🔐</div>
            <h2>Потрібна авторизація</h2>
            <p>Щоб переглядати свої оренди, потрібно увійти в систему або зареєструватись.</p>
            <button className="btn btn-primary btn-lg" onClick={onAuth}>Увійти / Реєстрація</button>
          </div>
        </div>
      </div>
    )
  }

  const displayed = rentals.filter(r => !filter || r.status === filter)

  const stats = {
    total: rentals.length,
    active: rentals.filter(r => r.status === 'active').length,
    spent: rentals.reduce((s, r) => s + (r.total_cost || 0), 0),
  }

  return (
    <div className="page-layout">
      <div className="page-hero rentals-hero">
        <div className="page-hero-shapes">
          <div className="page-hero-shape page-hero-shape-1" />
          <div className="page-hero-shape page-hero-shape-2" />
          <div className="page-hero-shape page-hero-shape-3" />
        </div>
        <div className="page-hero-content">
          <div className="page-hero-badge">🗓️ Оренди</div>
          <h1 className="page-hero-title">Мої оренди</h1>
          <p className="page-hero-sub">Привіт, {user.username}! Ось твоя історія оренд</p>
        </div>
      </div>

      <div className="page-content">
        {/* Stats summary */}
        <div className="rentals-stats">
          <div className="rental-stat-card">
            <span className="rental-stat-value">{stats.total}</span>
            <span className="rental-stat-label">Всього оренд</span>
          </div>
          <div className="rental-stat-card">
            <span className="rental-stat-value">{stats.active}</span>
            <span className="rental-stat-label">Активних</span>
          </div>
          <div className="rental-stat-card">
            <span className="rental-stat-value">{stats.spent} ₴</span>
            <span className="rental-stat-label">Витрачено</span>
          </div>
        </div>

        <div className="page-toolbar">
          <div className="page-filter-tabs">
            {[['', 'Всі'], ['active', '⚡ Активні'], ['completed', '✅ Завершені'], ['cancelled', '❌ Скасовані']].map(([val, lab]) => (
              <button key={val} className={`filter-tab${filter === val ? ' active' : ''}`} onClick={() => setFilter(val)}>{lab}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="page-loading">Завантаження...</div>
        ) : displayed.length === 0 ? (
          <div className="page-empty">🗓️ Оренд не знайдено</div>
        ) : (
          <div className="page-grid-2">
            {displayed.map(r => <RentalCard key={r.id} rental={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
