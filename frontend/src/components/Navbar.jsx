import { useState, useEffect, useRef } from 'react'

const NAV_PAGES = [
  { key: 'routes', label: '🗺️ Маршрути' },
  { key: 'tariffs', label: '💰 Тарифи' },
  { key: 'accessories', label: '🎒 Аксесуари' },
]
const AUTH_PAGES = [
  { key: 'rentals', label: '🗓️ Оренди' },
  { key: 'spare_parts', label: '⚙️ Запчастини' },
  { key: 'repairs', label: '🔧 Ремонти' },
]
const ADMIN_PAGES = [
  { key: 'clients', label: '👥 Клієнти' },
]

export default function Navbar({ user, page, onCatalog, onAbout, onTypes, onAuth, onAddBike, onProfile, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false)
  const [pagesOpen, setPagesOpen] = useState(false)
  const drawerRef = useRef(null)
  const dropRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function onResize() { if (window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!pagesOpen) return
    function onPointerDown(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setPagesOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [pagesOpen])

  function close() { setOpen(false) }
  function go(fn) { return () => { fn(); close() } }
  function goPage(p) { onNavigate(p); close(); setPagesOpen(false) }

  const allUserPages = [
    ...NAV_PAGES,
    ...(user ? AUTH_PAGES : []),
    ...(user?.is_superuser ? ADMIN_PAGES : []),
  ]

  return (
    <>
      <nav>
        <button className="nav-logo" onClick={() => goPage('home')}>
          🚲 <span>Bike</span>House
        </button>

        {/* Desktop links */}
        <div className="nav-links">
          {page === 'home' ? (
            <>
              <button onClick={onAbout}>Про нас</button>
              <button onClick={onTypes}>Типи</button>
              <button onClick={onCatalog}>Каталог</button>
            </>
          ) : (
            <button onClick={() => goPage('home')}>🏠 Головна</button>
          )}

          {/* Pages dropdown */}
          <div className="nav-pages-dropdown" ref={dropRef}>
            <button
              className={`nav-pages-btn${pagesOpen ? ' open' : ''}`}
              onClick={() => setPagesOpen(v => !v)}
              aria-label="Розділи сайту"
            >
              Розділи ▾
            </button>
            {pagesOpen && (
              <div className="nav-pages-menu">
                {NAV_PAGES.map(p => (
                  <button key={p.key} className={`nav-pages-item${page === p.key ? ' active' : ''}`} onClick={() => goPage(p.key)}>
                    {p.label}
                  </button>
                ))}
                {user && (
                  <>
                    <div className="nav-pages-divider" />
                    {AUTH_PAGES.map(p => (
                      <button key={p.key} className={`nav-pages-item${page === p.key ? ' active' : ''}`} onClick={() => goPage(p.key)}>
                        {p.label}
                      </button>
                    ))}
                  </>
                )}
                {user?.is_superuser && (
                  <>
                    <div className="nav-pages-divider" />
                    <div className="nav-pages-section-label">🛡️ Адмін</div>
                    {ADMIN_PAGES.map(p => (
                      <button key={p.key} className={`nav-pages-item${page === p.key ? ' active' : ''}`} onClick={() => goPage(p.key)}>
                        {p.label}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {user ? (
            <>
              <button className="nav-profile-btn" onClick={onProfile}>👤 {user.username}{user.is_superuser ? ' 🛡️' : ''}</button>
              {user.is_superuser && <button onClick={onAddBike}>+ Велосипед</button>}
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
        <button onClick={go(() => goPage('home'))}>🏠 Головна</button>
        {page === 'home' && (
          <>
            <button onClick={go(onAbout)}>Про нас</button>
            <button onClick={go(onTypes)}>Типи</button>
            <button onClick={go(onCatalog)}>Каталог</button>
          </>
        )}
        <div className="nav-drawer-divider" />
        {allUserPages.map(p => (
          <button key={p.key} className={page === p.key ? 'nav-drawer-active' : ''} onClick={go(() => goPage(p.key))}>
            {p.label}
          </button>
        ))}
        <div className="nav-drawer-divider" />
        {user ? (
          <>
            <button className="nav-profile-btn" onClick={go(onProfile)}>👤 {user.username}{user.is_superuser ? ' 🛡️' : ''}</button>
            {user.is_superuser && <button onClick={go(onAddBike)}>+ Велосипед</button>}
            <button className="btn-outline" onClick={go(onLogout)}>Вийти</button>
          </>
        ) : (
          <button className="btn-primary" onClick={go(onAuth)}>Увійти / Реєстрація</button>
        )}
      </div>
    </>
  )
}
