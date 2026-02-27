import { TYPE_EMOJI, TYPE_LABEL } from './BikeCard'

export default function DetailModal({ open, bike, user, onClose, onEdit, onDelete }) {
  if (!bike) return null

  const emoji = TYPE_EMOJI[bike.type] || '🚲'
  const label = TYPE_LABEL[bike.type] || bike.type
  const canEdit = user && (user.id === bike.owner_id || user.is_superuser)

  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={handleOverlay}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <span className="modal-title">{bike.name}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {bike.image_url ? (
            <img src={bike.image_url} alt={bike.name} className="detail-img"
              onError={e => { e.target.outerHTML = `<div class="detail-img" style="display:flex;align-items:center;justify-content:center;font-size:80px">${emoji}</div>` }} />
          ) : (
            <div className="detail-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {emoji}
            </div>
          )}
          <div className="detail-tags">
            <span className="tag tag-blue">{label}</span>
            <span className={`tag ${bike.is_available ? 'tag-green' : 'tag-red'}`}>
              {bike.is_available ? '✅ Доступний' : '❌ Недоступний'}
            </span>
          </div>
          {bike.description && (
            <p style={{ color: 'var(--muted)', marginBottom: 16, fontSize: '.95rem' }}>{bike.description}</p>
          )}
          <div className="detail-row">
            <span className="detail-key">Бренд</span>
            <span className="detail-val">{bike.brand}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Модель</span>
            <span className="detail-val">{bike.model}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Ціна</span>
            <span className="detail-val" style={{ color: 'var(--green)' }}>{bike.price_per_hour} ₴/год</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Додано</span>
            <span className="detail-val">{new Date(bike.created_at).toLocaleDateString('uk-UA')}</span>
          </div>
          {canEdit && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn-sm btn-sm-edit" style={{ flex: 1, padding: 10 }}
                onClick={() => { onEdit(bike); onClose() }}>✏️ Редагувати</button>
              <button className="btn-sm btn-sm-danger" style={{ flex: 1, padding: 10 }}
                onClick={() => onDelete(bike.id)}>🗑️ Видалити</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
