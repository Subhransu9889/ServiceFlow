import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, User, DollarSign, FileText, Image } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const TimelineStep = ({ step, completed, current, label }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
        completed
          ? 'bg-green text-white'
          : current
          ? 'bg-blue text-white ring-4 ring-blue/20'
          : 'bg-slate-200 text-slate-600'
      }`}
    >
      {completed ? '✓' : step}
    </div>
    <p className={`text-xs mt-2 font-medium ${completed ? 'text-green' : current ? 'text-blue' : 'text-slate-500'}`}>
      {label}
    </p>
  </div>
);

const STEP_LIST = [
  { key: 'Requested', label: 'Requested', step: 1 },
  { key: 'Confirmed', label: 'Confirmed', step: 2 },
  { key: 'In-progress', label: 'In Progress', step: 3 },
  { key: 'Completed', label: 'Completed', step: 4 }
];

export default function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workNotes, setWorkNotes] = useState('');
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [showProviderActions, setShowProviderActions] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [rescheduleAt, setRescheduleAt] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    // Keep booking progress fresh while user is viewing the details page.
    const intervalId = setInterval(() => {
      fetchBooking();
    }, 12000);

    return () => clearInterval(intervalId);
  }, [bookingId]);

  const getDashboardPath = () => {
    if (user.role === 'provider') return '/provider-dashboard';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/customer-dashboard';
  };

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBooking(data);
      setRescheduleAt(data?.scheduledAt ? new Date(data.scheduledAt).toISOString().slice(0, 16) : '');
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const filesToDataUrls = async (files) => {
    const readers = files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }));

    return Promise.all(readers);
  };

  const handleReschedule = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ scheduledAt: rescheduleAt })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to reschedule booking');
        return;
      }

      await fetchBooking();
      alert('Booking rescheduled successfully');
    } catch (error) {
      console.error('Error rescheduling booking:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to cancel booking');
        return;
      }

      await fetchBooking();
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProviderUpdate = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const [beforeDataUrls, afterDataUrls] = await Promise.all([
        filesToDataUrls(beforeImages),
        filesToDataUrls(afterImages)
      ]);

      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          workNotes,
          beforeImages: beforeDataUrls.filter(Boolean),
          afterImages: afterDataUrls.filter(Boolean)
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to update job details');
        return;
      }

      setShowProviderActions(false);
      await fetchBooking();
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProviderStatusChange = async (nextStatus) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to update booking status');
        return;
      }

      await fetchBooking();
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId,
          rating: review.rating,
          comment: review.comment
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to submit review');
        return;
      }

      alert('Review submitted successfully!');
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-slate-600 mt-4">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking not found</h2>
          <button
            onClick={() => navigate(getDashboardPath())}
            className="btn btn-primary mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = {
    Requested: 1,
    Confirmed: 2,
    'In-progress': 3,
    Completed: 4
  };

  const currentStep = statusSteps[booking.status] || 0;
  const canCustomerModify = user.role === 'customer' && (booking.status === 'Requested' || booking.status === 'Confirmed');
  const progressPercent = booking.status === 'Cancelled' ? 0 : Math.max(0, Math.min(100, ((currentStep - 1) / 3) * 100));

  return (
    <div className="min-h-[calc(100vh-68px)] bg-white relative z-10">
      <div className="container py-8">
        <button
          onClick={() => navigate(getDashboardPath())}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{booking.categoryId.name}</h1>
                  <p className="text-slate-500 mt-1">{booking.notes || 'No description'}</p>
                </div>
                <StatusBadge status={booking.status.toLowerCase()} />
              </div>

              <div className="my-8 p-6 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Booking Progress</h3>
                  <span className="text-xs text-slate-500">
                    Last updated: {new Date(booking.updatedAt || booking.createdAt).toLocaleString()}
                  </span>
                </div>

                {booking.status !== 'Cancelled' && (
                  <div className="mb-6">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {booking.status === 'Cancelled' ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-sm text-red-600 font-medium">This booking was cancelled.</p>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    {STEP_LIST.map((item, index) => (
                      <div key={item.key} className="flex items-start flex-1">
                        <TimelineStep
                          step={item.step}
                          completed={currentStep >= item.step}
                          current={currentStep === item.step}
                          label={item.label}
                        />
                        {index < STEP_LIST.length - 1 && (
                          <div className={`flex-1 mx-2 mt-5 h-0.5 ${currentStep > item.step ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-blue mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-semibold text-slate-900">{booking.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-blue mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">Scheduled Time</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(booking.scheduledAt).toLocaleDateString()} at {new Date(booking.scheduledAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {Array.isArray(booking.requestImages) && booking.requestImages.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Image size={20} />
                  Customer Uploaded Images
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {booking.requestImages.slice(0, 4).map((img, idx) => (
                    <img key={idx} src={img} alt={`Request ${idx + 1}`} className="w-full h-40 object-cover rounded-lg" />
                  ))}
                </div>
              </div>
            )}

            {booking.workNotes && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <div className="flex items-start gap-3">
                  <FileText size={20} className="text-amber mt-1 flex-shrink-0" />
                  <div className="w-full">
                    <p className="text-sm text-slate-500 mb-2">Work Notes</p>
                    <p className="text-slate-900">{booking.workNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {booking.status === 'Completed' && (booking.beforeImages?.length > 0 || booking.afterImages?.length > 0) && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Image size={20} />
                  Before & After
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {booking.beforeImages?.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Before</p>
                      <img src={booking.beforeImages[0]} alt="Before" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                  {booking.afterImages?.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-500 mb-2">After</p>
                      <img src={booking.afterImages[0]} alt="After" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {canCustomerModify && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 space-y-4">
                <h3 className="font-bold text-slate-900">Manage Booking</h3>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Reschedule Date & Time</label>
                  <input
                    type="datetime-local"
                    value={rescheduleAt}
                    onChange={(e) => setRescheduleAt(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button disabled={actionLoading || !rescheduleAt} onClick={handleReschedule} className="btn btn-primary">
                    Reschedule
                  </button>
                  <button disabled={actionLoading} onClick={handleCancelBooking} className="btn btn-ghost">
                    Cancel Booking
                  </button>
                </div>
              </div>
            )}

            {booking.status === 'Completed' && user.role === 'customer' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                {!showReviewForm ? (
                  <button onClick={() => setShowReviewForm(true)} className="btn btn-primary flex items-center gap-2">
                    <Star size={18} />
                    Leave a Review
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">Rate this service</h3>

                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReview({ ...review, rating: star })}
                            className={`text-3xl transition-colors ${star <= review.rating ? 'text-amber' : 'text-slate-300'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-2">Your Review</label>
                      <textarea
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                        rows="4"
                        placeholder="Share your experience with this service..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <button onClick={handleSubmitReview} className="btn btn-primary">Submit Review</button>
                      <button onClick={() => setShowReviewForm(false)} className="btn btn-ghost">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {user.role === 'provider' && booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="mb-4 flex gap-2 flex-wrap">
                  {booking.status === 'Requested' && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleProviderStatusChange('Confirmed')}
                        className="btn btn-primary"
                      >
                        Accept Request
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={handleCancelBooking}
                        className="btn btn-ghost"
                      >
                        Reject Request
                      </button>
                    </>
                  )}
                  {booking.status === 'Confirmed' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleProviderStatusChange('In-progress')}
                      className="btn btn-primary"
                    >
                      Start Job
                    </button>
                  )}
                  {booking.status === 'In-progress' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleProviderStatusChange('Completed')}
                      className="btn btn-success"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
                {!showProviderActions ? (
                  <button onClick={() => setShowProviderActions(true)} className="btn btn-primary">Update Job Details</button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">Update Job Details</h3>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Work Notes</label>
                      <textarea
                        value={workNotes}
                        onChange={(e) => setWorkNotes(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                        rows="3"
                        placeholder="Add notes about the work done..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Before Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setBeforeImages(Array.from(e.target.files || []))}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">After Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setAfterImages(Array.from(e.target.files || []))}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button disabled={actionLoading} onClick={handleProviderUpdate} className="btn btn-primary">Update Job</button>
                      <button onClick={() => setShowProviderActions(false)} className="btn btn-ghost">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h3 className="font-bold text-slate-900 mb-4">{user.role === 'provider' ? 'Customer' : 'Service Provider'}</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    user.role === 'provider'
                      ? `https://i.pravatar.cc/150?u=${booking.customerId.name}`
                      : booking.providerId.profileImage || `https://i.pravatar.cc/150?u=${booking.providerId.userId.name}`
                  }
                  alt={user.role === 'provider' ? booking.customerId.name : booking.providerId.userId.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {user.role === 'provider' ? booking.customerId.name : booking.providerId.userId.name}
                  </p>
                  {user.role === 'customer' && (
                    <div className="flex items-center gap-1 text-amber">
                      <span className="font-bold">4.8</span>
                      <Star size={14} fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <User size={16} />
                  {user.role === 'provider' ? booking.customerId.phone : booking.providerId.userId.name}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Price</span>
                <div className="flex items-center gap-1 text-2xl font-bold text-blue">
                  <DollarSign size={24} />
                  {booking.priceAtBooking}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
