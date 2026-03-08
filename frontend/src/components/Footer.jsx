import { ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand" href="#">
            <img src="/logo.png" alt="ServiceFlow Logo" className="brand-logo" />
            <span className="brand-text">ServiceFlow</span>
          </a>
          <p className="footer-copy">© 2026 ServiceFlow. All rights reserved.</p>
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Terms</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
