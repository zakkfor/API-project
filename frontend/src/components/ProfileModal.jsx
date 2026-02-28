import { useState, useEffect } from 'react'
import { getMyRentals } from '../api'

const PAY_LABEL = { card: '💳 Картка', cash: '💵 Готівка', apple_pay: '🍎 Apple Pay', google_pay: '🤖 Google Pay' }
const STATUS_LABEL = { active: { label: 'Активна', color: 'var(--green)' }, completed: { label: 'Завершена', color: 'var(--muted)' }, cancelled: { label: 'Скасована', color: 'var(--accent)' } }

export default function ProfileModal({ open, user, onClose }) {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) loadRentals()
  }, [open])

  async function loadRentals() {
    setLoading(true)
    const res = await getMyRentals()
    setLoading(false)
    if (res.ok) setRentals(res.data)
  }

  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose()
  }

  if (!user) return null

  const totalSpent = rentals.reduce((s, r) => s + r.total_price, 0).toFixed(2)

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={handleOverlay}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <span className="modal-title">👤 Мій кабінет</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Profile info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: '#27ae600d', borderRadius: 12, marginBottom: 24, border: '1px solid #27ae6022' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#27ae6026', border: '2px solid rgba(39,174,96,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
              {user.is_superuser ? '🛡️' : '👤'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                {user.username}
                {user.is_superuser && <span style={{ background: '#27ae601f', color: 'var(--green)', fontSize: '.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: '.5px' }}>АДМІН</span>}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.88rem', marginTop: 3 }}>{user.email}</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div style={{ background: '#ffffff08', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--green)' }}>{rentals.length}</div>
              <div style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: 2 }}>Всього оренд</div>
            </div>
            <div style={{ background: '#ffffff08', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--green)' }}>{totalSpent} ₴</div>
              <div style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: 2 }}>Витрачено всього</div>
            </div>
          </div>

          {/* Rental history */}
          <div style={{ fontWeight: 700, marginBottom: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', fontSize: '.78rem' }}>
            Історія оренд
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><div className="spinner" style={{ margin: 0 }} /></div>
          ) : rentals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🚲</div>
              Ви ще не орендували жодного велосипеда
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rentals.map(r => {
                const st = STATUS_LABEL[r.status] || STATUS_LABEL.active
                return (
                  <div key={r.id} style={{ background: '#ffffff06', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: '.95rem' }}>{r.bicycle?.name || `Велосипед #${r.bicycle_id}`}</div>
                      <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: '1rem', whiteSpace: 'nowrap', marginLeft: 8 }}>{r.total_price} ₴</div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--muted)', fontSize: '.82rem' }}>⏱ {r.hours} год</span>
                      <span style={{ color: 'var(--muted)', fontSize: '.82rem' }}>{PAY_LABEL[r.payment_method] || r.payment_method}</span>
                      <span style={{ color: st.color, fontSize: '.82rem', fontWeight: 600 }}>{st.label}</span>
                      <span style={{ color: 'var(--muted)', fontSize: '.82rem', marginLeft: 'auto' }}>
                        {r.created_at ? new Date(r.created_at).toLocaleDateString('uk-UA') : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
