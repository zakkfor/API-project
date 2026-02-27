export default function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast${t.error ? ' error' : ''}`}>{t.msg}</div>
      ))}
    </div>
  )
}
