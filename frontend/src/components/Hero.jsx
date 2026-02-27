export default function Hero({ user, onCatalog, onAbout, onAddBike, onAuth }) {
  return (
    <section className="hero">
      <h1>Твій ідеальний <em>велосипед</em> чекає</h1>
      <p>Оренда та продаж велосипедів для будь-якого маршруту — гори, місто, траса.</p>
      <div className="hero-btns">
        <button className="btn btn-green" onClick={onCatalog}>Переглянути каталог</button>
        {user && (
          <button className="btn btn-ghost" onClick={onAddBike}>+ Додати велосипед</button>
        )}
        {!user && (
          <button className="btn btn-ghost" onClick={onAuth}>Увійти / Реєстрація</button>
        )}
      </div>
      <button className="hero-scroll" onClick={onAbout} aria-label="Прокрутити вниз">
        ↓
      </button>
    </section>
  )
}
