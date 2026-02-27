import { useState, useEffect } from 'react'
import { createBicycle, updateBicycle } from '../api'

const EMPTY = { name: '', brand: '', model: '', type: '', price_per_hour: '', description: '', is_available: true, image_url: '' }

export default function BikeModal({ open, bike, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)
  const isEdit = !!bike

  useEffect(() => {
    if (open) {
      setAlert(null)
      setForm(bike ? {
        name: bike.name,
        brand: bike.brand,
        model: bike.model,
        type: bike.type,
        price_per_hour: bike.price_per_hour,
        description: bike.description || '',
        is_available: bike.is_available,
        image_url: bike.image_url || '',
      } : EMPTY)
    }
  }, [open, bike])

  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose()
  }

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setAlert(null)
    if (!form.name || !form.brand || !form.model || !form.type || !form.price_per_hour) {
      setAlert({ msg: "Заповніть обов'язкові поля (*)", error: true })
      return
    }
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      type: form.type,
      price_per_hour: parseFloat(form.price_per_hour),
      description: form.description.trim() || null,
      is_available: form.is_available === true || form.is_available === 'true',
      image_url: form.image_url.trim() || null,
    }
    setLoading(true)
    const res = isEdit ? await updateBicycle(bike.id, payload) : await createBicycle(payload)
    setLoading(false)
    if (res.ok) {
      onSaved(isEdit ? 'Велосипед оновлено ✓' : 'Велосипед додано! 🚲')
      onClose()
    } else {
      setAlert({ msg: res.data?.detail || 'Помилка збереження', error: true })
    }
  }

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={handleOverlay}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Редагувати велосипед' : 'Додати велосипед'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {alert && <div className={`alert-box ${alert.error ? 'alert-error' : 'alert-success'}`}>{alert.msg}</div>}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Назва *</label>
                <input className="form-control" placeholder="Trek FX 3" value={form.name} onChange={set('name')} />
              </div>
              <div className="form-group">
                <label className="form-label">Бренд *</label>
                <input className="form-control" placeholder="Trek" value={form.brand} onChange={set('brand')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Модель *</label>
                <input className="form-control" placeholder="FX 3 Disc" value={form.model} onChange={set('model')} />
              </div>
              <div className="form-group">
                <label className="form-label">Тип *</label>
                <select className="form-control" value={form.type} onChange={set('type')}>
                  <option value="">Оберіть тип</option>
                  <option value="mountain">🏔️ Гірський</option>
                  <option value="city">🏙️ Міський</option>
                  <option value="road">🛣️ Шосейний</option>
                  <option value="bmx">🤸 BMX</option>
                  <option value="electric">⚡ Електричний</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ціна за годину (₴) *</label>
                <input className="form-control" type="number" placeholder="50" min="1" step="0.5"
                  value={form.price_per_hour} onChange={set('price_per_hour')} />
              </div>
              <div className="form-group">
                <label className="form-label">Доступність</label>
                <select className="form-control" value={form.is_available ? 'true' : 'false'}
                  onChange={e => setForm(f => ({ ...f, is_available: e.target.value === 'true' }))}>
                  <option value="true">✅ Доступний</option>
                  <option value="false">❌ Недоступний</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">URL зображення</label>
              <input className="form-control" placeholder="https://..." value={form.image_url} onChange={set('image_url')} />
            </div>
            <div className="form-group">
              <label className="form-label">Опис</label>
              <textarea className="form-control" placeholder="Розкажіть про велосипед..." rows="3"
                style={{ resize: 'vertical' }} value={form.description} onChange={set('description')} />
            </div>
            <button className="form-submit" type="submit" disabled={loading}>
              {isEdit ? 'Зберегти зміни' : 'Додати велосипед'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
