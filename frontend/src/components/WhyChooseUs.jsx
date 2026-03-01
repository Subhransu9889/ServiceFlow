import { ShieldCheck, DollarSign, Activity, Lock } from 'lucide-react'

const features = [
  {
    Icon: ShieldCheck,
    title: 'Verified Professionals',
    description:
      'Every provider is screened for expertise, reliability, and service quality.',
  },
  {
    Icon: DollarSign,
    title: 'Transparent Pricing',
    description:
      'Know the estimated cost up front with no hidden fees or last-minute surprises.',
  },
  {
    Icon: Activity,
    title: 'Real-Time Status Tracking',
    description:
      'Track progress from request through completion in a single booking timeline.',
  },
  {
    Icon: Lock,
    title: 'Secure Booking Process',
    description:
      'Your bookings and provider interactions are protected with secure workflows.',
  },
]

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="section" aria-labelledby="why-heading">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Why Choose Us
          </div>
          <h2 id="why-heading">Built for trust, speed, and reliability</h2>
          <p>
            ServiceFlow brings professionalism and transparency to every home
            service booking.
          </p>
        </div>

        <div className="features-grid">
          {features.map(({ Icon, title, description }) => (
            <article className="feature-card" key={title}>
              <div className="feature-icon">
                <Icon size={20} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
