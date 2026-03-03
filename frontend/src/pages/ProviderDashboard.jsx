import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ToggleRight, ToggleLeft } from 'lucide-react';
import BookingCard from '../components/BookingCard';
import { mockBookings } from '../data/mockBookings';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const rawBookings = useState(mockBookings)[0];
  const [isAvailable, setIsAvailable] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // only show bookings where provider matches current user
  const bookings = rawBookings.filter(b => b.provider?.id === user.id);

  // Separate bookings by status
  const incomingRequests = bookings.filter(b => b.status === 'requested');
  const activeJobs = bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress');
  const completedJobs = bookings.filter(b => b.status === 'completed');

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  const handleAccept = (bookingId) => {
    alert(`Booking ${bookingId} accepted!`);
    // Update booking status to 'confirmed'
  };

  const handleReject = (bookingId) => {
    alert(`Booking ${bookingId} rejected!`);
    // Update booking status to 'cancelled'
  };

  const handleStartJob = (bookingId) => {
    alert(`Job ${bookingId} started!`);
    // Update booking status to 'in-progress'
  };

  const handleMarkCompleted = (bookingId) => {
    navigate(`/booking/${bookingId}/complete`);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-white relative z-10">
      <div className="container py-8">
        {/* Header with Availability Toggle */}
        <div className="flex justify-between items-center mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Dashboard, {user.name}</h1>
            <p className="text-slate-500 mt-1">Manage your service requests</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-500">Availability</p>
              <p className={`text-lg font-bold ${isAvailable ? 'text-green' : 'text-slate-500'}`}>
                {isAvailable ? 'Online' : 'Offline'}
              </p>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`p-3 rounded-lg transition-colors ${
                isAvailable
                  ? 'bg-green-light text-green'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {isAvailable ? (
                <ToggleRight size={32} />
              ) : (
                <ToggleLeft size={32} />
              )}
            </button>
          </div>
        </div>

        {/* Incoming Requests */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Incoming Requests</h2>
          <p className="text-slate-500 text-sm mb-6">{incomingRequests.length} new request{incomingRequests.length !== 1 ? 's' : ''}</p>

          {incomingRequests.length > 0 ? (
            <div className="booking-list">
              {incomingRequests.map(booking => (
                <div key={booking.id} className="booking-card group hover:shadow-md transition-all">
                  <div className="booking-left">
                    <img 
                      src={booking.customer.avatar || `https://i.pravatar.cc/150?u=${booking.customer.name}`}
                      alt={booking.customer.name}
                      className="booking-avatar"
                    />
                    <div className="booking-info">
                      <div className="booking-service">{booking.serviceType}</div>
                      <div className="booking-meta">Customer: {booking.customer.name}</div>
                      <div className="booking-meta">{booking.date} • ₹{booking.price}</div>
                    </div>
                  </div>

                  <div className="booking-right flex items-center gap-3">
                    <button
                      onClick={() => handleAccept(booking.id)}
                      className="btn btn-primary text-sm px-3 py-1.5"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="btn btn-outline text-sm px-3 py-1.5"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No incoming requests</p>
            </div>
          )}
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Active Jobs</h2>
          <p className="text-slate-500 text-sm mb-6">{activeJobs.length} active job{activeJobs.length !== 1 ? 's' : ''}</p>

          {activeJobs.length > 0 ? (
            <div className="booking-list">
              {activeJobs.map(booking => (
                <div key={booking.id} className="booking-card group hover:shadow-md transition-all">
                  <div className="booking-left">
                    <img 
                      src={booking.customer.avatar || `https://i.pravatar.cc/150?u=${booking.customer.name}`}
                      alt={booking.customer.name}
                      className="booking-avatar"
                    />
                    <div className="booking-info">
                      <div className="booking-service">{booking.serviceType}</div>
                      <div className="booking-meta">Customer: {booking.customer.name}</div>
                      <div className="booking-meta">{booking.date} • Status: {booking.status}</div>
                    </div>
                  </div>

                  <div className="booking-right flex items-center gap-3">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStartJob(booking.id)}
                        className="btn btn-primary text-sm px-3 py-1.5"
                      >
                        Start Job
                      </button>
                    )}
                    {booking.status === 'in-progress' && (
                      <button
                        onClick={() => handleMarkCompleted(booking.id)}
                        className="btn btn-primary text-sm px-3 py-1.5"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No active jobs</p>
            </div>
          )}
        </div>

        {/* Completed Jobs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Completed Jobs</h2>
          <p className="text-slate-500 text-sm mb-6">{completedJobs.length} completed job{completedJobs.length !== 1 ? 's' : ''}</p>

          {completedJobs.length > 0 ? (
            <div className="booking-list">
              {completedJobs.map(booking => (
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
              <CheckCircle size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No completed jobs yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
