const REVIEWS = [
  {
    name: 'Олексій М.',
    avatar: '👨‍💼',
    rating: 5,
    text: 'Орендував гірський велосипед на вихідні — якість чудова, ціна адекватна. Персонал привітний, велосипед чистий і добре налаштований.',
    date: 'Лютий 2025',
  },
  {
    name: 'Катерина В.',
    avatar: '👩‍💻',
    rating: 5,
    text: 'Зручний сайт, легко знайти потрібний велосипед. Взяла електробайк для поїздок містом — дуже задоволена! Буду звертатись ще.',
    date: 'Січень 2025',
  },
  {
    name: 'Денис Т.',
    avatar: '🧑‍🎓',
    rating: 4,
    text: 'Хороший каталог із детальними описами. Процес бронювання простий і зрозумілий. Рекомендую Bike House друзям і знайомим.',
    date: 'Грудень 2024',
  },
]

function Stars({ count }) {
  return (
    <div className="review-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <div className="section">
        <h2 className="section-title">💬 Відгуки клієнтів</h2>
        <p className="section-sub">Що кажуть ті, хто вже скористався нашим сервісом</p>
        <div className="reviews-grid">
          {REVIEWS.map(r => (
            <div key={r.name} className="review-card">
              <div className="review-header">
                <div className="review-avatar">{r.avatar}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-date">{r.date}</div>
                </div>
              </div>
              <Stars count={r.rating} />
              <p className="review-text">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
