export default function Hero({ user, onCatalog, onAbout, onAddBike, onAuth, onRent }) {
  return (
    <section className="hero">
      <div className="hero-bg-shapes">
        <div className="hero-shape shape-1" />
        <div className="hero-shape shape-2" />
        <div className="hero-shape shape-3" />
      </div>

      <div className="hero-badge">
        <span className="hero-badge-dot" />
        🚲 Найкращий велопрокат України
      </div>

      <h1>
        Твій ідеальний<br />
        <em>велосипед</em> чекає
      </h1>
      <p>
        Оренда та продаж велосипедів для будь-якого маршруту —<br />
        гори, місто, траса. Від 35 ₴/год без прихованих платежів.
      </p>

      <div className="hero-btns">
        <button className="btn btn-green btn-hero" onClick={onCatalog}>
          <span>🔍</span> Переглянути каталог
        </button>
        {user ? (
          <button className="btn btn-ghost btn-hero" onClick={onRent}>
            <span>🚲</span> Орендувати велосипед
          </button>
        ) : (
          <button className="btn btn-ghost btn-hero" onClick={onAuth}>
            <span>👤</span> Увійти / Реєстрація
          </button>
        )}
      </div>

      <div className="hero-trust">
        <div className="hero-trust-item">
          <span className="hero-trust-icon">✅</span>
          <span>Безкоштовна реєстрація</span>
        </div>
        <div className="hero-trust-divider" />
        <div className="hero-trust-item">
          <span className="hero-trust-icon">⚡</span>
          <span>Миттєве бронювання</span>
        </div>
        <div className="hero-trust-divider" />
        <div className="hero-trust-item">
          <span className="hero-trust-icon">🛡️</span>
          <span>Безпечна оплата</span>
        </div>
        <div className="hero-trust-divider" />
        <div className="hero-trust-item">
          <span className="hero-trust-icon">🔧</span>
          <span>Технічна підтримка</span>
        </div>
      </div>

      <button className="hero-scroll" onClick={onAbout} aria-label="Прокрутити вниз">
        ↓
      </button>
    </section>
  )
}
