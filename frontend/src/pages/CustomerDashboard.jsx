import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Briefcase, Clock, CheckCircle } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import BookingCard from '../components/BookingCard';
import { apiUrl } from '../config/api';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/bookings'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'Requested' || b.status === 'Confirmed' || b.status === 'In-progress').length,
    completed: bookings.filter(b => b.status === 'Completed').length
  };

  // Get active and upcoming bookings
  const upcomingBookings = bookings.filter(b => 
    b.status === 'Requested' || b.status === 'Confirmed' || b.status === 'In-progress'
  );

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  const handleBookService = () => {
    navigate('/browse-services');
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-white relative z-10">
      <div className="container py-8">
        {/* Success Message */}
        {location.state?.message && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            {location.state.message}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
            <p className="text-slate-500 mt-1">Manage your service bookings</p>
          </div>
          <button
            onClick={handleBookService}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Book New Service
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            icon={Briefcase}
            label="Total Bookings"
            value={stats.total}
            color="blue"
          />
          <SummaryCard
            icon={Clock}
            label="Active Bookings"
            value={stats.active}
            color="amber"
          />
          <SummaryCard
            icon={CheckCircle}
            label="Completed Jobs"
            value={stats.completed}
            color="green"
          />
        </div>

        {/* Upcoming Bookings Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Upcoming & Active Bookings</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading bookings...</p>
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="booking-list">
              {upcomingBookings.map(booking => (
                <BookingCard
                  key={booking._id}
                  booking={{
                    id: booking._id,
                    serviceType: booking.categoryId.name,
                    provider: {
                      name: booking.providerId.userId.name,
                      avatar: booking.providerId.profileImage || `https://i.pravatar.cc/150?u=${booking.providerId.userId.name}`
                    },
                    date: new Date(booking.scheduledAt).toLocaleDateString(),
                    time: new Date(booking.scheduledAt).toLocaleTimeString(),
                    status: booking.status.toLowerCase(),
                    address: booking.address,
                    price: booking.priceAtBooking,
                    description: booking.notes || 'No description'
                  }}
                  onViewDetails={() => handleViewDetails(booking._id)}
                  showAction={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg">No active bookings yet</p>
              <button
                onClick={handleBookService}
                className="btn btn-primary mt-4"
              >
                Book a Service
              </button>
            </div>
          )}
        </div>

        {/* All Bookings Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Booking History</h2>

          {bookings.length > 0 ? (
            <div className="booking-list">
              {bookings.map(booking => (
                <BookingCard
                  key={booking._id}
                  booking={{
                    id: booking._id,
                    serviceType: booking.categoryId.name,
                    provider: {
                      name: booking.providerId.userId.name,
                      rating: 4.8 // TODO: calculate from reviews
                    },
                    date: new Date(booking.scheduledAt).toLocaleDateString(),
                    time: new Date(booking.scheduledAt).toLocaleTimeString(),
                    status: booking.status.toLowerCase(),
                    address: booking.address,
                    price: booking.priceAtBooking,
                    description: booking.notes || 'No description'
                  }}
                  onViewDetails={() => handleViewDetails(booking._id)}
                  showAction={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No bookings found</p>
          )}
        </div>
      </div>
    </div>
  );
}
