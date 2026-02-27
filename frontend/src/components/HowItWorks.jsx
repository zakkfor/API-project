const STEPS = [
  {
    num: '01',
    icon: '👤',
    title: 'Створіть акаунт',
    text: 'Безкоштовна реєстрація займає менше хвилини. Вкажіть email та придумайте пароль.',
  },
  {
    num: '02',
    icon: '🔍',
    title: 'Оберіть велосипед',
    text: 'Переглядайте каталог, фільтруйте за типом та ціною. Детальна інформація по кожній моделі.',
  },
  {
    num: '03',
    icon: '✅',
    title: 'Забронюйте онлайн',
    text: 'Натисніть "Деталі", ознайомтесь з умовами та підтвердіть бронювання в один клік.',
  },
  {
    num: '04',
    icon: '🚲',
    title: 'Насолоджуйтесь поїздкою',
    text: 'Отримайте велосипед у пункті видачі та вирушайте в нову пригоду!',
  },
]

export default function HowItWorks() {
  return (
    <section className="how-section">
      <div className="section">
        <h2 className="section-title">🗺️ Як це працює?</h2>
        <p className="section-sub">Чотири простих кроки до вашої ідеальної поїздки</p>
        <div className="how-grid">
          {STEPS.map((step, i) => (
            <div key={step.num} className="how-card">
              <div className="how-num">{step.num}</div>
              <div className="how-icon">{step.icon}</div>
              <h3 className="how-title">{step.title}</h3>
              <p className="how-text">{step.text}</p>
              {i < STEPS.length - 1 && <div className="how-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
