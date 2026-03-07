import './App.css'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BrowseServices from './pages/BrowseServices'
import CreateBooking from './pages/CreateBooking'
import CustomerDashboard from './pages/CustomerDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import BookingDetails from './pages/BookingDetails'

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes('dashboard') || location.pathname.startsWith('/booking');
  const showAmbient = !isDashboard;
  const showFooter = !isDashboard;

  // if user lands on root while already logged in, send them to correct dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && location.pathname === '/') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'provider') navigate('/provider-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/customer-dashboard');
    }
  }, [location.pathname, navigate]);

  return (
    <div className={isDashboard ? '' : 'landing-page'}>
      {showAmbient && (
        <>
          <div className="ambient ambient-1" aria-hidden="true" />
          <div className="ambient ambient-2" aria-hidden="true" />
        </>
      )}
      
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/browse-services"
          element={
            <ProtectedRoute requiredRole="customer">
              <BrowseServices />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/create-booking"
          element={
            <ProtectedRoute requiredRole="customer">
              <CreateBooking />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/booking/:bookingId"
          element={
            <ProtectedRoute>
              <BookingDetails />
            </ProtectedRoute>
          }
        />
      </Routes>

      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
