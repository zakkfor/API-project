import { useState } from 'react'
import { login, register, saveToken } from '../api'

export default function AuthModal({ open, onClose, onLogin }) {
  const [tab, setTab] = useState('login')
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [regForm, setRegForm] = useState({ email: '', username: '', password: '' })
  const [loginAlert, setLoginAlert] = useState(null)
  const [regAlert, setRegAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose()
  }

  function switchTab(t) {
    setTab(t)
    setLoginAlert(null)
    setRegAlert(null)
  }

  async function doLogin(e) {
    e.preventDefault()
    setLoginAlert(null)
    if (!loginForm.username || !loginForm.password) {
      setLoginAlert({ msg: 'Заповніть всі поля', error: true })
      return
    }
    setLoading(true)
    const res = await login(loginForm.username, loginForm.password)
    setLoading(false)
    if (res.ok) {
      saveToken(res.data.access_token)
      onLogin(res.data.access_token)
      onClose()
    } else {
      setLoginAlert({ msg: res.data?.detail || 'Помилка входу', error: true })
    }
  }

  async function doRegister(e) {
    e.preventDefault()
    setRegAlert(null)
    if (!regForm.email || !regForm.username || !regForm.password) {
      setRegAlert({ msg: 'Заповніть всі поля', error: true })
      return
    }
    if (regForm.password.length < 6) {
      setRegAlert({ msg: 'Пароль має бути мін. 6 символів', error: true })
      return
    }
    setLoading(true)
    const res = await register(regForm.username, regForm.email, regForm.password)
    setLoading(false)
    if (res.ok) {
      setRegAlert({ msg: 'Реєстрацію успішно завершено! Тепер увійдіть.', error: false })
      setTimeout(() => switchTab('login'), 1500)
    } else {
      setRegAlert({ msg: res.data?.detail || 'Помилка реєстрації', error: true })
    }
  }

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={handleOverlay}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Вхід / Реєстрація</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-tabs">
            <button className={`form-tab${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>Увійти</button>
            <button className={`form-tab${tab === 'register' ? ' active' : ''}`} onClick={() => switchTab('register')}>Реєстрація</button>
          </div>

          {tab === 'login' && (
            <form onSubmit={doLogin}>
              {loginAlert && <div className={`alert-box ${loginAlert.error ? 'alert-error' : 'alert-success'}`}>{loginAlert.msg}</div>}
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-control" placeholder="your_username" value={loginForm.username}
                  onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Пароль</label>
                <input className="form-control" type="password" placeholder="••••••••" value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button className="form-submit" type="submit" disabled={loading}>Увійти</button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={doRegister}>
              {regAlert && <div className={`alert-box ${regAlert.error ? 'alert-error' : 'alert-success'}`}>{regAlert.msg}</div>}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" placeholder="user@example.com" value={regForm.email}
                  onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-control" placeholder="your_username" value={regForm.username}
                  onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Пароль</label>
                <input className="form-control" type="password" placeholder="мін. 6 символів" value={regForm.password}
                  onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button className="form-submit" type="submit" disabled={loading}>Зареєструватись</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
