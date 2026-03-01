import { ArrowRight } from 'lucide-react'
import DashboardMockup from './DashboardMockup'

export default function HeroSection() {
  return (
    <section className="hero container" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          Local Services Booking Platform
        </div>

        <h1 id="hero-heading">
          Book Trusted{' '}
          <span className="gradient-text">Local Professionals</span> in Minutes
        </h1>

        <p className="hero-desc">
          Connect with verified service providers and track your job from request
          to completion.
        </p>

        <div className="cta-group">
          <button type="button" className="btn btn-primary btn-lg">
            Get Started <ArrowRight size={16} />
          </button>
          <button type="button" className="btn btn-outline btn-lg">
            Become a Provider
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">1,247+</span>
            <span className="stat-label">Verified Providers</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">4.9 ★</span>
            <span className="stat-label">Avg. Rating</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">50K+</span>
            <span className="stat-label">Bookings Completed</span>
          </div>
        </div>
      </div>

      <DashboardMockup />
    </section>
  )
}
