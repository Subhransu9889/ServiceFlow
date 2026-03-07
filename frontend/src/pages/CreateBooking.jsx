import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, FileText, Image, DollarSign } from 'lucide-react';
import { apiUrl } from '../config/api';

export default function CreateBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { provider } = location.state || {};

  const [formData, setFormData] = useState({
    address: '',
    scheduledAt: '',
    notes: '',
    image: null,
    imageDataUrl: ''
  });
  const [loading, setLoading] = useState(false);

  if (!provider) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Provider not found</h2>
          <button
            onClick={() => navigate('/browse-services')}
            className="btn btn-primary mt-4"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        providerId: provider._id,
        categoryId: provider.categoryId._id || provider.categoryId,
        address: formData.address,
        scheduledAt: formData.scheduledAt,
        notes: formData.notes,
        requestImages: formData.imageDataUrl ? [formData.imageDataUrl] : [],
        priceAtBooking: provider.pricing
      };

      const response = await fetch(apiUrl('/api/bookings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        await response.json();
        navigate('/customer-dashboard', {
          state: { message: 'Booking request submitted successfully!' }
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imageDataUrl: typeof reader.result === 'string' ? reader.result : ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50">
      <div className="container py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/browse-services')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft size={18} />
          Back to Services
        </button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Book Service</h1>
          <p className="text-slate-600 mb-8">Complete your booking request</p>

          {/* Provider Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-4">Service Provider</h2>
            <div className="flex items-center gap-4">
              <img
                src={provider.profileImage || `https://i.pravatar.cc/150?u=${provider.userId.name}`}
                alt={provider.userId.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-slate-900">{provider.userId.name}</h3>
                <p className="text-slate-600">{provider.categoryId.name}</p>
                <p className="text-slate-500">{provider.city}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6">
            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Address
              </label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-slate-400" />
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                  rows="3"
                  placeholder="Enter the complete address where service is needed"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preferred Date & Time
              </label>
              <div className="relative">
                <Clock size={20} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Notes (Optional)
              </label>
              <div className="relative">
                <FileText size={20} className="absolute left-3 top-3 text-slate-400" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                  rows="3"
                  placeholder="Any special instructions or requirements..."
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Image (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <Image size={24} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {formData.image ? formData.image.name : 'Click to upload an image'}
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Service Price</span>
                <div className="flex items-center gap-1 text-2xl font-bold text-blue-600">
                  <DollarSign size={24} />
                  {provider.pricing}
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                This price is an estimate. Final price may vary based on actual work required.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
