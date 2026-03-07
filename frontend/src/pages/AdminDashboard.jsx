import { useState, useEffect } from 'react';
import { Users, Briefcase, Star, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    pendingProviders: 0,
    totalBookings: 0,
    totalReviews: 0
  });
  const [pendingProviders, setPendingProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch stats
      const [usersRes, providersRes, bookingsRes, reviewsRes] = await Promise.all([
        fetch('https://serviceflow-wwo1.onrender.com/api/users/admin/all', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://serviceflow-wwo1.onrender.com/api/providers/admin/all', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://serviceflow-wwo1.onrender.com/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://serviceflow-wwo1.onrender.com/api/reviews/admin/all', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const users = await usersRes.json();
      const providers = await providersRes.json();
      const bookings = await bookingsRes.json();
      const reviews = await reviewsRes.json();

      setStats({
        totalUsers: users.length,
        totalProviders: providers.length,
        pendingProviders: providers.filter(p => !p.isApproved).length,
        totalBookings: bookings.length,
        totalReviews: reviews.length
      });

      setPendingProviders(providers.filter(p => !p.isApproved));
      setReviews(reviews);

      // Fetch categories
      const categoriesRes = await fetch('https://serviceflow-wwo1.onrender.com/api/categories');
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProvider = async (providerId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://serviceflow-wwo1.onrender.com/api/providers/${providerId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: true })
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error approving provider:', error);
    }
  };

  const handleRejectProvider = async (providerId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://serviceflow-wwo1.onrender.com/api/providers/${providerId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: false })
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting provider:', error);
    }
  };

  const handleAddCategory = async () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName) {
      try {
        const token = localStorage.getItem('token');
        await fetch('https://serviceflow-wwo1.onrender.com/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: categoryName })
        });
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`https://serviceflow-wwo1.onrender.com/api/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (confirm('Delete this review?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`https://serviceflow-wwo1.onrender.com/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-slate-600 mt-4">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-68px)] bg-white relative z-10">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage the service platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-blue" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                <p className="text-sm text-slate-500">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <Briefcase size={24} className="text-green" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalProviders}</p>
                <p className="text-sm text-slate-500">Total Providers</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-amber" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.pendingProviders}</p>
                <p className="text-sm text-slate-500">Pending Approvals</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-blue" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalBookings}</p>
                <p className="text-sm text-slate-500">Total Bookings</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <Star size={24} className="text-amber" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalReviews}</p>
                <p className="text-sm text-slate-500">Total Reviews</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Provider Approvals */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Pending Approvals</h2>
            </div>

            {pendingProviders.length > 0 ? (
              <div className="space-y-4">
                {pendingProviders.map(provider => (
                  <div key={provider._id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{provider.userId.name}</h3>
                        <p className="text-slate-600">{provider.categoryId.name}</p>
                        <p className="text-sm text-slate-500">{provider.city}</p>
                        <p className="text-sm text-slate-500">₹{provider.pricing} per service</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveProvider(provider._id)}
                        className="btn btn-success"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectProvider(provider._id)}
                        className="btn btn-ghost"
                      >
                        <XCircle size={16} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No pending approvals</p>
            )}
          </div>

          {/* Service Categories Management */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Service Categories</h2>
              <button
                onClick={handleAddCategory}
                className="btn btn-primary"
              >
                Add Category
              </button>
            </div>

            <div className="space-y-3">
              {categories.map(category => (
                <div key={category._id} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{category.name}</p>
                    {category.description && (
                      <p className="text-sm text-slate-500">{category.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Review Moderation</h2>
          {reviews.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No reviews available</p>
          ) : (
            <div className="space-y-4">
              {reviews.slice(0, 20).map((review) => (
                <div key={review._id} className="border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {review.customerId?.name || 'Customer'} • {review.rating}/5
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{review.comment || 'No comment provided'}</p>
                  </div>
                  <button onClick={() => handleDeleteReview(review._id)} className="btn btn-ghost text-red-600">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
