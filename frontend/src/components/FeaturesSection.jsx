const FEATURES = [
  {
    icon: '🚵',
    title: 'Широкий вибір',
    text: 'Понад 10 моделей різних типів: гірські, міські, шосейні, BMX та електричні',
  },
  {
    icon: '💳',
    title: 'Зручна оренда',
    text: 'Прозоре ціноутворення від 35 ₴/год. Без прихованих платежів і зайвих умов',
  },
  {
    icon: '📸',
    title: 'Фото велосипеда',
    text: 'Завантажуйте власні фото велосипедів прямо з телефону або комп\'ютера',
  },
  {
    icon: '🔒',
    title: 'Захищений акаунт',
    text: 'JWT-аутентифікація та bcrypt-шифрування паролів — ваші дані в безпеці',
  },
]

export default function FeaturesSection() {
  return (
    <section id="about" className="features-section">
      <div className="section">
        <h2 className="section-title">✨ Чому Bike House?</h2>
        <p className="section-sub">Все що потрібно для ідеального велопоходу</p>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
