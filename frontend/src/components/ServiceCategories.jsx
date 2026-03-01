import { Wrench, Sparkles, Zap, Wind, Paintbrush, Hammer } from 'lucide-react'

const categories = [
  { title: 'Plumbing', Icon: Wrench, colorClass: 'cat-plumbing' },
  { title: 'Cleaning', Icon: Sparkles, colorClass: 'cat-cleaning' },
  { title: 'Electrician', Icon: Zap, colorClass: 'cat-electric' },
  { title: 'AC Repair', Icon: Wind, colorClass: 'cat-ac' },
  { title: 'Painting', Icon: Paintbrush, colorClass: 'cat-painting' },
  { title: 'Carpenter', Icon: Hammer, colorClass: 'cat-carpenter' },
]

export default function ServiceCategories() {
  return (
    <section
      id="categories"
      className="section section-alt"
      aria-labelledby="cat-heading"
    >
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Service Categories
          </div>
          <h2 id="cat-heading">Find professionals by service type</h2>
          <p>
            Browse from a wide range of home services, all backed by verified
            professionals ready to help.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map(({ title, Icon, colorClass }) => (
            <article className="category-card" key={title}>
              <div className={`category-icon ${colorClass}`}>
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <button type="button" className="text-btn">
                View Providers
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
