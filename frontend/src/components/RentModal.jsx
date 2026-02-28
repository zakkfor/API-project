import { useState, useEffect } from 'react'
import { createRental } from '../api'

const HOURS_OPTIONS = [1, 2, 3, 4, 6, 8, 12, 24]
const PAY_METHODS = [
  { value: 'card',       label: 'Картка',     icon: '💳' },
  { value: 'cash',       label: 'Готівка',    icon: '💵' },
  { value: 'apple_pay',  label: 'Apple Pay',  icon: '🍎' },
  { value: 'google_pay', label: 'Google Pay', icon: '🤖' },
]

export default function RentModal({ open, bike, onClose, onRented }) {
  const [hours, setHours] = useState(1)
  const [payMethod, setPayMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (open) { setHours(1); setPayMethod('card'); setAlert(null) }
  }, [open])

  if (!bike) return null

  const total = (hours * bike.price_per_hour).toFixed(2)

  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setAlert(null)
    setLoading(true)
    const res = await createRental({ bicycle_id: bike.id, hours, payment_method: payMethod })
    setLoading(false)
    if (res.ok) {
      onRented(`Оренду підтверджено! 🎉 Загалом: ${res.data.total_price} ₴`)
      onClose()
    } else {
      setAlert(res.data?.detail || 'Помилка оренди')
    }
  }

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={handleOverlay}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">🔑 Орендувати велосипед</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Bike summary */}
          <div style={{ background: '#27ae600d', border: '1px solid #27ae6033', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{bike.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '.88rem' }}>{bike.brand} · {bike.model}</div>
            <div style={{ color: 'var(--green)', fontWeight: 800, fontSize: '1.1rem', marginTop: 6 }}>{bike.price_per_hour} ₴ / год</div>
          </div>

          <form onSubmit={handleSubmit}>
            {alert && <div className="alert-box alert-error">{alert}</div>}

            {/* Hours */}
            <div className="form-group">
              <label className="form-label">Кількість годин</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {HOURS_OPTIONS.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHours(h)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      border: '1.5px solid',
                      borderColor: hours === h ? 'var(--green)' : 'rgba(255,255,255,.12)',
                      background: hours === h ? '#27ae601a' : 'transparent',
                      color: hours === h ? 'var(--green)' : 'var(--muted)',
                      fontWeight: 600,
                      fontSize: '.9rem',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all .2s',
                    }}
                  >
                    {h}г
                  </button>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div className="form-group" style={{ marginTop: 4 }}>
              <label className="form-label">Спосіб оплати</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {PAY_METHODS.map(m => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setPayMethod(m.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid',
                      borderColor: payMethod === m.value ? 'var(--green)' : 'rgba(255,255,255,.1)',
                      background: payMethod === m.value ? '#27ae601a' : 'transparent',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '.9rem',
                      fontWeight: 600,
                      transition: 'all .2s',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{m.icon}</span> {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price summary */}
            <div style={{ background: '#ffffff08', borderRadius: 10, padding: '14px 16px', margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>{hours} год × {bike.price_per_hour} ₴</span>
              <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--green)' }}>{total} ₴</span>
            </div>

            <button className="form-submit" type="submit" disabled={loading}>
              {loading ? 'Обробка...' : `💳 Оплатити ${total} ₴`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
