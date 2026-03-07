import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Clock, DollarSign } from 'lucide-react';

export default function BrowseServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    city: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.city) queryParams.append('city', filters.city);

      const response = await fetch(`http://localhost:8000/api/providers?${queryParams}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (provider) => {
    // Navigate to booking creation with provider data
    navigate('/create-booking', { state: { provider } });
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse Services</h1>
          <p className="text-slate-600">Find and book trusted service providers in your area</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City/Area
              </label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter city or area"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <Search size={48} className="text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No services found</h3>
            <p className="text-slate-600">Try adjusting your filters or search in a different area</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service._id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={service.profileImage || `https://i.pravatar.cc/150?u=${service.userId.name}`}
                      alt={service.userId.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">{service.userId.name}</h3>
                      <p className="text-sm text-slate-500">{service.categoryId.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} />
                    {service.city}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign size={16} />
                    ₹{service.pricing} per service
                  </div>
                </div>

                {service.bio && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{service.bio}</p>
                )}

                <button
                  onClick={() => handleBookService(service)}
                  className="w-full btn btn-primary"
                >
                  Book Service
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}