const TYPE_EMOJI = { mountain: '🏔️', city: '🏙️', road: '🛣️', bmx: '🤸', electric: '⚡' }
const TYPE_LABEL = { mountain: 'Гірський', city: 'Міський', road: 'Шосейний', bmx: 'BMX', electric: 'Електричний' }

export { TYPE_EMOJI, TYPE_LABEL }

export default function BikeCard({ bike, user, onDetail, onEdit, onDelete, onRent }) {
  const emoji = TYPE_EMOJI[bike.type] || '🚲'
  const label = TYPE_LABEL[bike.type] || bike.type
  const canEdit = user && (user.id === bike.owner_id || user.is_superuser)
  const canRent = user && !user.is_superuser && bike.is_available

  return (
    <div className="bike-card" onClick={() => onDetail(bike)}>
      <div className="bike-card-img">
        {bike.image_url
          ? <img src={bike.image_url} alt={bike.name} onError={e => { e.target.style.display = 'none' }} />
          : <span>{emoji}</span>
        }
        <span className={`availability-dot ${bike.is_available ? 'available' : 'unavailable'}`} />
        <span className="bike-type-badge">{label}</span>
      </div>
      <div className="bike-card-body">
        <div className="bike-name">{bike.name}</div>
        <div className="bike-brand">{bike.brand} · {bike.model}</div>
        <div className="bike-price">{bike.price_per_hour} ₴ <small>/ год</small></div>
      </div>
      <div className="bike-card-footer">
        <button className="btn-sm btn-sm-green" onClick={e => { e.stopPropagation(); onDetail(bike) }}>Деталі</button>
        {canRent && (
          <button className="btn-sm" style={{ background: '#27ae6033', color: 'var(--green)', border: '1px solid #27ae6044', flex: 'none', padding: '9px 14px' }}
            onClick={e => { e.stopPropagation(); onRent(bike) }}>🔑</button>
        )}
        {canEdit && (
          <>
            <button className="btn-sm btn-sm-edit" onClick={e => { e.stopPropagation(); onEdit(bike) }}>✏️</button>
            <button className="btn-sm btn-sm-danger" onClick={e => { e.stopPropagation(); onDelete(bike.id) }}>🗑️</button>
          </>
        )}
      </div>
    </div>
  )
}
