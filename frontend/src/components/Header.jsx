import { ArrowRight } from 'lucide-react'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#">
          <img src="/logo.png" alt="ServiceFlow Logo" className="brand-logo hover:scale-110 duration-300 transition-transform ease-in-out" />
          <span className="brand-text">ServiceFlow</span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#how-it-works">How It Works</a>
          <a href="#categories">Services</a>
          <a href="#why-us">Why Us</a>
        </nav>

        <div className="header-actions">
          <button type="button" className="btn btn-ghost">
            Login
          </button>
          <button type="button" className="btn btn-primary">
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}
