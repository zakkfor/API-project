import BikeCard from './BikeCard'

const FILTERS = [
  { value: '', label: 'Всі' },
  { value: 'mountain', label: '🏔️ Гірські' },
  { value: 'city', label: '🏙️ Міські' },
  { value: 'road', label: '🛣️ Шосейні' },
  { value: 'bmx', label: '🤸 BMX' },
  { value: 'electric', label: '⚡ Електричні' },
  { value: 'gravel', label: '🪨 Gravel' },
]

const SORTS = [
  { value: 'default', label: 'За замовчуванням' },
  { value: 'price-asc', label: '💰 Ціна ↑' },
  { value: 'price-desc', label: '💰 Ціна ↓' },
  { value: 'name', label: '🔤 Назва А→Я' },
]

function SkeletonCard() {
  return <div className="bike-card-skeleton" />
}

export default function BikeGrid({ bikes, loading, filter, availableOnly, search, sort, user, onFilterChange, onAvailableChange, onSearchChange, onSortChange, onDetail, onEdit, onDelete, onRent }) {
  const bikeList = bikes ?? []
  return (
    <div className="section" id="catalog">
      <div className="section-title">🚵 Каталог велосипедів</div>
      <div className="section-sub">Оберіть велосипед за типом або переглянь усі доступні варіанти</div>

      {/* Search + Sort toolbar */}
      <div className="catalog-toolbar">
        <input
          className="catalog-search"
          type="search"
          placeholder="🔍 Пошук за назвою, брендом, моделлю..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
        <select
          className="catalog-sort"
          value={sort}
          onChange={e => onSortChange(e.target.value)}
        >
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

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
          Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
        ) : bikeList.length === 0 ? (
          <div className="empty-state">
            <span>🚲</span>
            {search ? `Нічого не знайдено за запитом «${search}»` : <>Велосипедів не знайдено.<br />Будьте першим — додайте свій!</>}
          </div>
        ) : (
          bikeList.map((bike, i) => (
            <BikeCard
              key={bike.id}
              bike={bike}
              user={user}
              animIndex={i}
              onDetail={onDetail}
              onEdit={onEdit}
              onDelete={onDelete}
              onRent={onRent}
            />
          ))
        )}
      </div>
    </div>
  )
}
