export default function StatsBar({ total, available }) {
  return (
    <div className="stats-bar">
      <div className="stat">
        <div className="stat-num">{total ?? '—'}</div>
        <div className="stat-label">Велосипедів у каталозі</div>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <div className="stat-num">{available ?? '—'}</div>
        <div className="stat-label">Доступні зараз</div>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <div className="stat-num">6</div>
        <div className="stat-label">Типів велосипедів</div>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <div className="stat-num">35₴</div>
        <div className="stat-label">Від / година</div>
      </div>
    </div>
  )
}
