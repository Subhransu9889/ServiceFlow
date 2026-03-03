import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, User, DollarSign, FileText, Image } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { mockBookings } from '../data/mockBookings';

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

export default function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const booking = mockBookings.find(b => b.id === parseInt(bookingId));

  if (!booking) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking not found</h2>
          <button
            onClick={() => navigate(user.role === 'provider' ? '/provider-dashboard' : '/customer-dashboard')}
            className="btn btn-primary mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = {
    requested: 1,
    confirmed: 2,
    'in-progress': 3,
    completed: 4
  };

  const currentStep = statusSteps[booking.status];

  const handleSubmitReview = () => {
    alert(`Review submitted: ${review.rating} stars - "${review.comment}"`);
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-white relative z-10">
      <div className="container py-8">
        {/* Header */}
        <button
          onClick={() => navigate(user.role === 'provider' ? '/provider-dashboard' : '/customer-dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{booking.serviceType}</h1>
                  <p className="text-slate-500 mt-1">{booking.description}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              {/* Timeline */}
              <div className="my-8 p-6 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wide">Booking Progress</h3>
                <div className="flex justify-between items-start">
                  <TimelineStep
                    step={1}
                    completed={currentStep >= 1}
                    current={currentStep === 1}
                    label="Requested"
                  />
                  <div className="flex-1 mx-2 mt-5 h-0.5 bg-slate-300" />
                  <TimelineStep
                    step={2}
                    completed={currentStep >= 2}
                    current={currentStep === 2}
                    label="Confirmed"
                  />
                  <div className="flex-1 mx-2 mt-5 h-0.5 bg-slate-300" />
                  <TimelineStep
                    step={3}
                    completed={currentStep >= 3}
                    current={currentStep === 3}
                    label="In Progress"
                  />
                  <div className="flex-1 mx-2 mt-5 h-0.5 bg-slate-300" />
                  <TimelineStep
                    step={4}
                    completed={currentStep >= 4}
                    current={currentStep === 4}
                    label="Completed"
                  />
                </div>
              </div>
            </div>

            {/* Details */}
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
                    <p className="font-semibold text-slate-900">{booking.date} at {booking.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <div className="flex items-start gap-3">
                  <FileText size={20} className="text-amber mt-1 flex-shrink-0" />
                  <div className="w-full">
                    <p className="text-sm text-slate-500 mb-2">Work Notes</p>
                    <p className="text-slate-900">{booking.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Before/After Images */}
            {booking.status === 'completed' && (booking.images.before || booking.images.after) && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Image size={20} />
                  Before & After
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {booking.images.before && (
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Before</p>
                      <img src={booking.images.before} alt="Before" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                  {booking.images.after && (
                    <div>
                      <p className="text-sm text-slate-500 mb-2">After</p>
                      <img src={booking.images.after} alt="After" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Review Section - Only for completed bookings for customers */}
            {booking.status === 'completed' && user.role === 'customer' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Star size={18} />
                    Leave a Review
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">Rate this service</h3>

                    {/* Rating */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setReview({ ...review, rating: star })}
                            className={`text-3xl transition-colors ${
                              star <= review.rating ? 'text-amber' : 'text-slate-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
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

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleSubmitReview}
                        className="btn btn-primary"
                      >
                        Submit Review
                      </button>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Provider/Customer Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h3 className="font-bold text-slate-900 mb-4">
                {user.role === 'provider' ? 'Customer' : 'Service Provider'}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user.role === 'provider' ? (booking.customer.avatar || `https://i.pravatar.cc/150?u=${booking.customer.name}`) : booking.provider.avatar}
                  alt={user.role === 'provider' ? booking.customer.name : booking.provider.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {user.role === 'provider' ? booking.customer.name : booking.provider.name}
                  </p>
                  {user.role === 'customer' && (
                    <div className="flex items-center gap-1 text-amber">
                      <span className="font-bold">{booking.provider.rating}</span>
                      <Star size={14} fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <User size={16} />
                  {user.role === 'provider' ? booking.customer.phone : booking.provider.name}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Price</span>
                <div className="flex items-center gap-1 text-2xl font-bold text-blue">
                  <DollarSign size={24} />
                  {booking.price}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
