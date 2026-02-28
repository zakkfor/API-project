import { useState, useEffect } from 'react'

export default function Navbar({ user, onCatalog, onAbout, onTypes, onAuth, onAddBike, onProfile, onLogout }) {
  const [open, setOpen] = useState(false)

  function close() { setOpen(false) }

  function handle(fn) {
    return () => { fn(); close() }
  }

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close drawer when viewport becomes wide enough (orientation change)
  useEffect(() => {
    function onResize() { if (window.innerWidth > 900) close() }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <nav>
        <button className="nav-logo" onClick={handle(onCatalog)}>
          🚲 <span>Bike</span>House
        </button>

        {/* Desktop links */}
        <div className="nav-links">
          <button onClick={onAbout}>Про нас</button>
          <button onClick={onTypes}>Типи</button>
          <button onClick={onCatalog}>Каталог</button>
          {user ? (
            <>
              <button className="nav-profile-btn" onClick={onProfile}>👤 {user.username}{user.is_superuser ? ' 🛡️' : ''}</button>
              {user.is_superuser && <button onClick={onAddBike}>+ Додати велосипед</button>}
              <button className="btn-outline" onClick={onLogout}>Вийти</button>
            </>
          ) : (
            <button className="btn-primary" onClick={onAuth}>Увійти / Реєстрація</button>
          )}
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className={`nav-burger${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Меню"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && <div className="nav-mobile-overlay" onClick={close} />}
      <div className={`nav-mobile-drawer${open ? ' open' : ''}`}>
        <button onClick={handle(onAbout)}>Про нас</button>
        <button onClick={handle(onTypes)}>Типи</button>
        <button onClick={handle(onCatalog)}>Каталог</button>
        {user ? (
          <>
            <button className="nav-profile-btn" onClick={handle(onProfile)}>👤 {user.username}{user.is_superuser ? ' 🛡️' : ''}</button>
            {user.is_superuser && <button onClick={handle(onAddBike)}>+ Додати велосипед</button>}
            <button className="btn-outline" onClick={handle(onLogout)}>Вийти</button>
          </>
        ) : (
          <button className="btn-primary" onClick={handle(onAuth)}>Увійти / Реєстрація</button>
        )}
      </div>
    </>
  )
}
