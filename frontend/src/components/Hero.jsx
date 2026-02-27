export default function Hero({ user, onCatalog, onAddBike, onAuth }) {
  return (
    <section className="hero">
      <h1>Твій ідеальний <em>велосипед</em> чекає</h1>
      <p>Оренда та продаж велосипедів для будь-якого маршруту — гори, місто, траса.</p>
      <div className="hero-btns">
        <button className="btn btn-green" onClick={onCatalog}>Переглянути каталог</button>
        {user && (
          <button className="btn btn-ghost" onClick={onAddBike}>Додати свій велосипед</button>
        )}
        {!user && (
          <button className="btn btn-ghost" onClick={onAuth}>Увійти / Реєстрація</button>
        )}
      </div>
    </section>
  )
}
