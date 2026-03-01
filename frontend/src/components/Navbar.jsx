import { useState, useEffect, useRef } from 'react'

export default function Navbar({ user, onCatalog, onAbout, onTypes, onAuth, onAddBike, onProfile, onLogout }) {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef(null)

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on desktop resize
  useEffect(() => {
    function onResize() { if (window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function close() { setOpen(false) }
  function go(fn) { return () => { fn(); close() } }

  return (
    <>
      <nav>
        <button className="nav-logo" onClick={go(onCatalog)}>
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

        {/* Burger button — mobile only */}
        <button
          className={`nav-burger${open ? ' open' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label="Меню"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        className={`nav-drawer${open ? ' open' : ''}`}
        aria-hidden={!open}
      >
        <button onClick={go(onAbout)}>Про нас</button>
        <button onClick={go(onTypes)}>Типи</button>
        <button onClick={go(onCatalog)}>Каталог</button>
        {user ? (
          <>
            <button className="nav-profile-btn" onClick={go(onProfile)}>👤 {user.username}{user.is_superuser ? ' 🛡️' : ''}</button>
            {user.is_superuser && <button onClick={go(onAddBike)}>+ Додати велосипед</button>}
            <button className="btn-outline" onClick={go(onLogout)}>Вийти</button>
          </>
        ) : (
          <button className="btn-primary" onClick={go(onAuth)}>Увійти / Реєстрація</button>
        )}
      </div>
    </>
  )
}
