import { useState, useEffect } from 'react'

const TOAST_LEAVING_MS = 2800
const TOAST_REMOVE_MS = 3500

function ToastItem({ t, onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), TOAST_LEAVING_MS)
    const t2 = setTimeout(() => onDone(), TOAST_REMOVE_MS)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`toast${t.error ? ' error' : ''}${leaving ? ' leaving' : ''}`}>{t.msg}</div>
  )
}

export default function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} t={t} onDone={() => onRemove(t.id)} />
      ))}
    </div>
  )
}
