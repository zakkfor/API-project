import { useState, useEffect } from 'react'
import { getDbInfo } from '../api'

const DB_ICONS = {
  SQLITE: '🗂️',
  POSTGRESQL: '🐘',
  MYSQL: '🐬',
  MARIADB: '🐬',
}

export default function DbInfoCard() {
  const [info, setInfo] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getDbInfo().then(res => {
      if (res.ok) setInfo(res.data)
    })
  }, [])

  if (!info) return null

  const icon = DB_ICONS[info.db_type] ?? '🗄️'

  return (
    <div className="db-info-card">
      <button
        className="db-info-toggle"
        onClick={() => setOpen(o => !o)}
        title="Інформація про базу даних"
      >
        <span className="db-info-icon">{icon}</span>
        <span className="db-info-label">
          {info.db_type} · {info.db_name.split('/').pop()}
        </span>
        <span className="db-info-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="db-info-panel">
          <div className="db-info-row">
            <span className="db-info-key">Тип бази</span>
            <span className="db-info-val">{icon} {info.db_type}</span>
          </div>
          <div className="db-info-row">
            <span className="db-info-key">Файл / назва</span>
            <span className="db-info-val">{info.db_name}</span>
          </div>
          <div className="db-info-row">
            <span className="db-info-key">ORM</span>
            <span className="db-info-val">{info.orm}</span>
          </div>
          <div className="db-info-divider" />
          <div className="db-info-row db-info-row--header">
            <span className="db-info-key">Таблиця</span>
            <span className="db-info-val">Записів</span>
          </div>
          {info.tables.map(t => (
            <div className="db-info-row" key={t}>
              <span className="db-info-key db-info-table">{t}</span>
              <span className="db-info-val db-info-count">
                {info.row_counts?.[t] != null ? info.row_counts[t] : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
