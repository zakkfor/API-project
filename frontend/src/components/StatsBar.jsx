export default function StatsBar({ total, available }) {
  return (
    <div className="stats-bar">
      <div className="stat">
        <div className="stat-num">{total ?? '—'}</div>
        <div className="stat-label">Велосипедів у каталозі</div>
      </div>
      <div className="stat">
        <div className="stat-num">{available ?? '—'}</div>
        <div className="stat-label">Доступні зараз</div>
      </div>
      <div className="stat">
        <div className="stat-num">5</div>
        <div className="stat-label">Типів велосипедів</div>
      </div>
    </div>
  )
}
