const TYPES = [
  { key: 'mountain', emoji: '🏔️', label: 'Гірські', desc: 'Трейли та позашляхове катання' },
  { key: 'city',     emoji: '🏙️', label: 'Міські',  desc: 'Комфортні велосипеди для міста' },
  { key: 'road',     emoji: '🛣️', label: 'Шосейні', desc: 'Швидкість та аеродинаміка' },
  { key: 'bmx',      emoji: '🤸', label: 'BMX',     desc: 'Трюки та активне катання' },
  { key: 'electric', emoji: '⚡', label: 'Електро',  desc: 'Сучасні e-байки для міста і гір' },
]

export default function TypesSection({ onFilterChange, onCatalog }) {
  function handleType(key) {
    onFilterChange(key)
    onCatalog()
  }

  return (
    <section id="types" className="types-section">
      <div className="section">
        <h2 className="section-title">🚴 Типи велосипедів</h2>
        <p className="section-sub">Знайдіть свій ідеальний варіант — натисніть для перегляду каталогу</p>
        <div className="types-grid">
          {TYPES.map(t => (
            <button key={t.key} className="type-card" onClick={() => handleType(t.key)}>
              <div className="type-emoji">{t.emoji}</div>
              <div className="type-label">{t.label}</div>
              <div className="type-desc">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
