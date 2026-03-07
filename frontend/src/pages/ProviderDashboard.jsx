import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ToggleRight, ToggleLeft, Briefcase, TrendingUp, CheckCircle2 } from 'lucide-react';
import BookingCard from '../components/BookingCard';
import { mockProviderBookings, mockProviderProfile, mockProviderStats } from '../data/mockProviders';
import { apiUrl } from '../config/api';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [profileForm, setProfileForm] = useState({
    city: '',
    bio: '',
    pricing: '',
    profileImage: ''
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBookings();
    fetchProfile();
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
      // If API returns empty array or no data, use mock data
      if (!data || data.length === 0) {
        setBookings(mockProviderBookings);
      } else {
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Use mock data as fallback on error
      setBookings(mockProviderBookings);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/providers/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data && data.isAvailable !== undefined) {
        setIsAvailable(data.isAvailable);
        setProfileForm({
          city: data.city || '',
          bio: data.bio || '',
          pricing: data.pricing || '',
          profileImage: data.profileImage || ''
        });
      } else {
        setIsAvailable(mockProviderProfile.isAvailable);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use mock data as fallback
      setIsAvailable(mockProviderProfile.isAvailable);
    }
  };

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(apiUrl('/api/providers/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: !isAvailable })
      });
      setIsAvailable(!isAvailable);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/providers/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.message || 'Failed to update profile');
        return;
      }

      alert('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Separate bookings by status
  const incomingRequests = bookings.filter(b => b.status === 'Requested');
  const activeJobs = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In-progress');
  const completedJobs = bookings.filter(b => b.status === 'Completed');

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  const handleAccept = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(apiUrl(`/api/bookings/${bookingId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Confirmed' })
      });
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(apiUrl(`/api/bookings/${bookingId}/cancel`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleStartJob = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(apiUrl(`/api/bookings/${bookingId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'In-progress' })
      });
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error starting job:', error);
    }
  };

  const handleMarkCompleted = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(apiUrl(`/api/bookings/${bookingId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Completed' })
      });
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error completing job:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-white relative z-10">
      <div className="container py-8">
        {/* Header with Availability Toggle */}
        <div className="flex justify-between items-center mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Dashboard, {user.name}</h1>
            {user.providerProfile && (
              <p className="text-slate-500 mt-1">
                {user.providerProfile.category} in {user.providerProfile.city} • ₹{user.providerProfile.pricing}/hr
              </p>
            )}
            {!user.providerProfile && (
              <p className="text-slate-500 mt-1">
                {mockProviderProfile.category} in {mockProviderProfile.city} • ₹{mockProviderProfile.pricing}/hr
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-500">Availability</p>
              <p className={`text-lg font-bold ${isAvailable ? 'text-green' : 'text-slate-500'}`}>
                {isAvailable ? 'Online' : 'Offline'}
              </p>
            </div>
            <button
              onClick={toggleAvailability}
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

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Professional Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">City / Area</label>
              <input
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Pricing</label>
              <input
                type="number"
                min="0"
                value={profileForm.pricing}
                onChange={(e) => setProfileForm({ ...profileForm, pricing: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-600 mb-2">Profile Image URL</label>
              <input
                value={profileForm.profileImage}
                onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-600 mb-2">Bio</label>
              <textarea
                rows="3"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4">
            <button onClick={saveProfile} className="btn btn-primary">Save Profile</button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900">{mockProviderStats.totalBookings}</p>
              </div>
              <Briefcase size={32} className="text-blue-600 opacity-70" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Completed Jobs</p>
                <p className="text-2xl font-bold text-slate-900">{mockProviderStats.completedJobs}</p>
              </div>
              <CheckCircle2 size={32} className="text-green-600 opacity-70" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-6 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Rating</p>
                <p className="text-2xl font-bold text-slate-900">⭐ {mockProviderStats.averageRating}</p>
              </div>
              <TrendingUp size={32} className="text-amber-600 opacity-70" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">This Month</p>
                <p className="text-2xl font-bold text-slate-900">₹{mockProviderStats.monthlyEarnings}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Incoming Requests */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Incoming Requests</h2>
          <p className="text-slate-500 text-sm mb-6">{incomingRequests.length} new request{incomingRequests.length !== 1 ? 's' : ''}</p>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading requests...</p>
            </div>
          ) : incomingRequests.length > 0 ? (
            <div className="space-y-4">
              {incomingRequests.map(booking => (
                <div key={booking._id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{booking.categoryId.name}</h3>
                      <p className="text-slate-600">{booking.customerId.name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(booking.scheduledAt).toLocaleDateString()} at {new Date(booking.scheduledAt).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-slate-500">{booking.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue">₹{booking.priceAtBooking}</p>
                    </div>
                  </div>
                  {booking.notes && (
                    <p className="text-sm text-slate-600 mb-4">{booking.notes}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(booking._id)}
                      className="btn btn-primary"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(booking._id)}
                      className="btn btn-ghost"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleViewDetails(booking._id)}
                      className="btn btn-outline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No incoming requests</p>
          )}
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Active Jobs</h2>
          <p className="text-slate-500 text-sm mb-6">{activeJobs.length} job{activeJobs.length !== 1 ? 's' : ''} in progress</p>

          {activeJobs.length > 0 ? (
            <div className="space-y-4">
              {activeJobs.map(booking => (
                <div key={booking._id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{booking.categoryId.name}</h3>
                      <p className="text-slate-600">{booking.customerId.name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(booking.scheduledAt).toLocaleDateString()} at {new Date(booking.scheduledAt).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-slate-500">{booking.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue">₹{booking.priceAtBooking}</p>
                      <p className={`text-sm ${booking.status === 'Confirmed' ? 'text-amber' : 'text-blue'}`}>
                        {booking.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => handleStartJob(booking._id)}
                        className="btn btn-primary"
                      >
                        Start Job
                      </button>
                    )}
                    {booking.status === 'In-progress' && (
                      <button
                        onClick={() => handleMarkCompleted(booking._id)}
                        className="btn btn-success"
                      >
                        Mark Completed
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(booking._id)}
                      className="btn btn-outline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No active jobs</p>
          )}
        </div>

        {/* Completed Jobs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Completed Jobs</h2>
          <p className="text-slate-500 text-sm mb-6">{completedJobs.length} job{completedJobs.length !== 1 ? 's' : ''} completed</p>

          {completedJobs.length > 0 ? (
            <div className="space-y-4">
              {completedJobs.map(booking => (
                <div key={booking._id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{booking.categoryId.name}</h3>
                      <p className="text-slate-600">{booking.customerId.name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(booking.scheduledAt).toLocaleDateString()} at {new Date(booking.scheduledAt).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-slate-500">{booking.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green">₹{booking.priceAtBooking}</p>
                      <p className="text-sm text-green">Completed</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(booking._id)}
                      className="btn btn-outline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No completed jobs</p>
          )}
        </div>
      </div>
    </div>
  );
}
