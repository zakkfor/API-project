import BikeCard from './BikeCard'

const FILTERS = [
  { value: '', label: 'Всі' },
  { value: 'mountain', label: '🏔️ Гірські' },
  { value: 'city', label: '🏙️ Міські' },
  { value: 'road', label: '🛣️ Шосейні' },
  { value: 'bmx', label: '🤸 BMX' },
  { value: 'electric', label: '⚡ Електричні' },
]

export default function BikeGrid({ bikes, loading, filter, availableOnly, user, onFilterChange, onAvailableChange, onDetail, onEdit, onDelete }) {
  return (
    <div className="section" id="catalog">
      <div className="section-title">🚵 Каталог велосипедів</div>
      <div className="section-sub">Оберіть велосипед за типом або переглянь усі доступні варіанти</div>
      <div className="filters">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`filter-btn${filter === f.value ? ' active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
        <label className="filter-available">
          <input type="checkbox" checked={availableOnly} onChange={e => onAvailableChange(e.target.checked)} />
          Тільки доступні
        </label>
      </div>
      <div className="bike-grid">
        {loading ? (
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center' }}>
            <div className="spinner" />
          </div>
        ) : bikes.length === 0 ? (
          <div className="empty-state">
            <span>🚲</span>
            Велосипедів не знайдено.<br />Будьте першим — додайте свій!
          </div>
        ) : (
          bikes.map(bike => (
            <BikeCard
              key={bike.id}
              bike={bike}
              user={user}
              onDetail={onDetail}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
