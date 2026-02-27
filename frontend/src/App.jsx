import { useState, useEffect, useCallback } from 'react'
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
  const [modal, setModal] = useState(null) // null | 'auth' | 'addBike' | 'editBike' | 'detail'
  const [selectedBike, setSelectedBike] = useState(null)

  function addToast(msg, error = false) {
    const id = ++toastCounter
    setToasts(prev => [...prev, { id, msg, error }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
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
    if (res.ok) setBikes(res.data)
    // also load all bikes for stats
    const all = await getBicycles({ limit: 1000 })
    if (all.ok) setAllBikes(all.data)
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

  function openAddBike() {
    if (!user) { setModal('auth'); return }
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

  return (
    <>
      <Navbar
        user={user}
        onCatalog={scrollToCatalog}
        onAbout={scrollToAbout}
        onTypes={scrollToTypes}
        onAuth={() => setModal('auth')}
        onAddBike={openAddBike}
        onLogout={handleLogout}
      />
      <Hero
        user={user}
        onCatalog={scrollToCatalog}
        onAbout={scrollToAbout}
        onAddBike={openAddBike}
        onAuth={() => setModal('auth')}
      />
      <StatsBar total={totalBikes} available={availBikes} />
      <FeaturesSection />
      <HowItWorks />
      <TypesSection onFilterChange={setFilter} onCatalog={scrollToCatalog} />
      <TestimonialsSection />
      <BikeGrid
        bikes={bikes}
        loading={loading}
        filter={filter}
        availableOnly={availableOnly}
        user={user}
        onFilterChange={setFilter}
        onAvailableChange={setAvailableOnly}
        onDetail={openDetail}
        onEdit={openEditBike}
        onDelete={handleDelete}
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
            <div className="footer-col-title">Розробнику</div>
            <a className="footer-link" href="/docs" target="_blank" rel="noreferrer">API Документація</a>
            <a className="footer-link" href="/redoc" target="_blank" rel="noreferrer">ReDoc</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Контакти</div>
            <span className="footer-link">📧 info@bikehouse.ua</span>
            <span className="footer-link">📞 +380 XX XXX XX XX</span>
            <span className="footer-link">📍 Київ, Україна</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 <strong>Bike House</strong> — Усі права захищено</p>
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
      />
      <Toast toasts={toasts} />
    </>
  )
}
