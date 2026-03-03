import { ArrowRight, LogOut, User as UserIcon } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // keep user state in sync with localStorage whenever route changes
  useEffect(() => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleDashboard = () => {
    if (user?.role === 'provider') {
      navigate('/provider-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/">
          <img src="/logo.png" alt="ServiceFlow Logo" className="brand-logo hover:scale-110 duration-300 transition-transform ease-in-out" />
          <span className="brand-text">ServiceFlow</span>
        </Link>

        {!user && (
          <nav className="site-nav" aria-label="Main navigation">
            <a href="/#how-it-works">How It Works</a>
            <a href="/#categories">Services</a>
            <a href="/#why-us">Why Us</a>
          </nav>
        )}

        <div className="header-actions">
          {user ? (
            <>
              <button
                onClick={handleDashboard}
                className="btn btn-ghost flex items-center gap-2"
              >
                <UserIcon size={16} />
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-primary flex items-center gap-2"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
