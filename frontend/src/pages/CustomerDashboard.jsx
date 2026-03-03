import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Clock, CheckCircle } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import BookingCard from '../components/BookingCard';
import { mockBookings } from '../data/mockBookings';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const rawBookings = useState(mockBookings)[0];
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // restrict bookings to those belonging to the logged in customer
  const bookings = rawBookings.filter(b => b.customer?.id === user.id);

  // Calculate statistics
  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };

  // Get active and upcoming bookings
  const upcomingBookings = bookings.filter(b => 
    b.status === 'confirmed' || b.status === 'in-progress'
  );

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  const handleBookService = () => {
    navigate('/book-service');
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-white relative z-10">
      <div className="container py-8">
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

          {upcomingBookings.length > 0 ? (
            <div className="booking-list">
              {upcomingBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onViewDetails={() => handleViewDetails(booking.id)}
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
                  key={booking.id}
                  booking={booking}
                  onViewDetails={() => handleViewDetails(booking.id)}
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
