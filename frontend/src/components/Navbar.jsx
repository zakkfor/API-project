export default function Navbar({ user, onCatalog, onAuth, onAddBike, onLogout }) {
  return (
    <nav>
      <button className="nav-logo" onClick={onCatalog}>
        🚲 <span>Bike</span>House
      </button>
      <div className="nav-links">
        <button onClick={onCatalog}>Каталог</button>
        {user ? (
          <>
            <span className="nav-username">👤 {user.username}</span>
            <button onClick={onAddBike}>+ Додати велосипед</button>
            <button className="btn-outline" onClick={onLogout}>Вийти</button>
          </>
        ) : (
          <button className="btn-primary" onClick={onAuth}>Увійти / Реєстрація</button>
        )}
      </div>
    </nav>
  )
}
