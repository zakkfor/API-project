import { useState, useEffect, useCallback, useMemo } from 'react'
import { getMe, getBicycles, deleteBicycle, removeToken } from './api'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import FeaturesSection from './components/FeaturesSection'
import HowItWorks from './components/HowItWorks'
import TypesSection from './components/TypesSection'
import TestimonialsSection from './components/TestimonialsSection'
import BikeGrid from './components/BikeGrid'
import AuthModal from './components/AuthModal'
import BikeModal from './components/BikeModal'
import DetailModal from './components/DetailModal'
import RentModal from './components/RentModal'
import ProfileModal from './components/ProfileModal'
import Toast from './components/Toast'

let toastCounter = 0

export default function App() {
  const [user, setUser] = useState(null)
  const [bikes, setBikes] = useState([])
  const [allBikes, setAllBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState(null) // null | 'auth' | 'addBike' | 'editBike' | 'detail' | 'rent' | 'profile'
  const [selectedBike, setSelectedBike] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [showTop, setShowTop] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)

  function addToast(msg, error = false) {
    const id = ++toastCounter
    setToasts(prev => [...prev, { id, msg, error }])
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  async function loadUser() {
    const token = localStorage.getItem('token')
    if (!token) { setUser(null); return }
    const res = await getMe()
    if (res.ok) setUser(res.data)
    else { removeToken(); setUser(null) }
  }

  const loadBikes = useCallback(async () => {
    setLoading(true)
    const res = await getBicycles({ type: filter, available_only: availableOnly, limit: 200 })
    setLoading(false)
    if (res.ok) setBikes(res.data ?? [])
    // also load all bikes for stats
    const all = await getBicycles({ limit: 1000 })
    if (all.ok) setAllBikes(all.data ?? [])
  }, [filter, availableOnly])

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    loadBikes()
  }, [loadBikes])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Scroll progress bar + back-to-top
  useEffect(() => {
    function onScroll() {
      const d = document.documentElement
      const s = d.scrollTop
      const h = d.scrollHeight - d.clientHeight
      setScrollPct(h > 0 ? (s / h) * 100 : 0)
      setShowTop(s > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-reveal — staggered per-item animations
  useEffect(() => {
    const vh = window.innerHeight
    const itemSel = [
      '.feature-card', '.how-card', '.type-card', '.review-card',
      '.stat', '.section-title', '.section-sub',
      '.footer-brand', '.footer-col',
    ].join(', ')
    const allItems = [...document.querySelectorAll(itemSel)]

    // Assign stagger index per parent group
    const parents = new Map()
    allItems.forEach(el => {
      const p = el.parentElement
      if (!parents.has(p)) parents.set(p, [])
      parents.get(p).push(el)
    })
    parents.forEach(els => els.forEach((el, i) => el.style.setProperty('--ri-i', i)))

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('ri-visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    allItems.forEach(el => {
      if (el.getBoundingClientRect().top >= vh * 0.88) {
        el.classList.add('ri-pre')
        obs.observe(el)
      }
    })
    return () => obs.disconnect()
  }, [])

  function scrollToCatalog() {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  function scrollToAbout() {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  function scrollToTypes() {
    document.getElementById('types')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleLogin(token) {
    loadUser().then(() => {
      loadBikes()
      // toast will be triggered after user loads
    })
    addToast('Ласкаво просимо! 👋')
  }

  function handleLogout() {
    removeToken()
    setUser(null)
    loadBikes()
    addToast('Ви вийшли з системи')
  }

  function openRent(bike) {
    if (!user) { setModal('auth'); return }
    setSelectedBike(bike)
    setModal('rent')
  }

  function openProfile() {
    if (!user) { setModal('auth'); return }
    setModal('profile')
  }

  function openAddBike() {
    if (!user) { setModal('auth'); return }
    if (!user.is_superuser) { addToast('Тільки адміністратори можуть додавати велосипеди', true); return }
    setSelectedBike(null)
    setModal('addBike')
  }

  function openEditBike(bike) {
    setSelectedBike(bike)
    setModal('editBike')
  }

  function openDetail(bike) {
    setSelectedBike(bike)
    setModal('detail')
  }

  async function handleDelete(id) {
    if (!window.confirm('Видалити цей велосипед?')) return
    const res = await deleteBicycle(id)
    if (res.ok) {
      setModal(null)
      loadBikes()
      addToast('Велосипед видалено')
    } else {
      addToast(res.data?.detail || 'Помилка видалення', true)
    }
  }

  function onBikeSaved(msg) {
    loadBikes()
    addToast(msg)
  }

  const totalBikes = allBikes.length || null
  const availBikes = allBikes.filter(b => b.is_available).length || null

  // Client-side search + sort applied on top of server-filtered bikes
  const displayBikes = useMemo(() => {
    let list = [...bikes]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.brand.toLowerCase().includes(q) ||
        b.model.toLowerCase().includes(q)
      )
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price_per_hour - b.price_per_hour)
    else if (sort === 'price-desc') list.sort((a, b) => b.price_per_hour - a.price_per_hour)
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'uk'))
    return list
  }, [bikes, search, sort])

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar
        user={user}
        onCatalog={scrollToCatalog}
        onAbout={scrollToAbout}
        onTypes={scrollToTypes}
        onAuth={() => setModal('auth')}
        onAddBike={openAddBike}
        onProfile={openProfile}
        onLogout={handleLogout}
      />
      <Hero
        user={user}
        onCatalog={scrollToCatalog}
        onAbout={scrollToAbout}
        onAddBike={openAddBike}
        onAuth={() => setModal('auth')}
        onRent={scrollToCatalog}
      />
      <StatsBar total={totalBikes} available={availBikes} />
      <FeaturesSection />
      <HowItWorks />
      <TypesSection onFilterChange={setFilter} onCatalog={scrollToCatalog} />
      <TestimonialsSection />
      <BikeGrid
        bikes={displayBikes}
        loading={loading}
        filter={filter}
        availableOnly={availableOnly}
        search={search}
        sort={sort}
        user={user}
        onFilterChange={setFilter}
        onAvailableChange={setAvailableOnly}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onDetail={openDetail}
        onEdit={openEditBike}
        onDelete={handleDelete}
        onRent={openRent}
      />
      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">🚲 <strong>Bike House</strong></div>
            <p className="footer-tagline">Твій велосипедний партнер</p>
            <p className="footer-desc">Оренда та продаж велосипедів для будь-якого маршруту.</p>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Навігація</div>
            <button className="footer-link" onClick={scrollToAbout}>Про нас</button>
            <button className="footer-link" onClick={scrollToTypes}>Типи велосипедів</button>
            <button className="footer-link" onClick={scrollToCatalog}>Каталог</button>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Контакти</div>
            <span className="footer-link">📧 info@bikehouse.ua</span>
            <span className="footer-link">📍 Вінниця, Україна</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 <strong>Bike House</strong> — Усі права захищено</p>
        </div>
      </footer>

      <AuthModal
        open={modal === 'auth'}
        onClose={() => setModal(null)}
        onLogin={handleLogin}
      />
      <BikeModal
        open={modal === 'addBike' || modal === 'editBike'}
        bike={modal === 'editBike' ? selectedBike : null}
        onClose={() => setModal(null)}
        onSaved={onBikeSaved}
      />
      <DetailModal
        open={modal === 'detail'}
        bike={selectedBike}
        user={user}
        onClose={() => setModal(null)}
        onEdit={bike => { setModal(null); openEditBike(bike) }}
        onDelete={handleDelete}
        onRent={openRent}
      />
      <RentModal
        open={modal === 'rent'}
        bike={selectedBike}
        onClose={() => setModal(null)}
        onRented={msg => { addToast(msg); loadBikes() }}
      />
      <ProfileModal
        open={modal === 'profile'}
        user={user}
        onClose={() => setModal(null)}
      />
      <Toast toasts={toasts} onRemove={removeToast} />
      {showTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Вгору">↑</button>
      )}
    </>
  )
}
