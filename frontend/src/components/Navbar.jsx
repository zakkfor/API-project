export default function Navbar({ user, onCatalog, onAbout, onTypes, onAuth, onAddBike, onLogout }) {
  return (
    <nav>
      <button className="nav-logo" onClick={onCatalog}>
        🚲 <span>Bike</span>House
      </button>
      <div className="nav-links">
        <button onClick={onAbout}>Про нас</button>
        <button onClick={onTypes}>Типи</button>
        <button onClick={onCatalog}>Каталог</button>
        <button onClick={onAddBike}>+ Додати велосипед</button>
        {user ? (
          <>
            <span className="nav-username">👤 {user.username}</span>
            <button className="btn-outline" onClick={onLogout}>Вийти</button>
          </>
        ) : (
          <button className="btn-primary" onClick={onAuth}>Увійти / Реєстрація</button>
        )}
      </div>
    </nav>
  )
}
