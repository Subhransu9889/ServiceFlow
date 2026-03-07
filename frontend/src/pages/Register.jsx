import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { apiUrl } from '../config/api'

export default function Register() {
  const staticCategories = ['Plumbing', 'Cleaning', 'Electrical', 'Painting', 'AC Repair'];
  const [categories, setCategories] = useState(staticCategories);

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '', 
    role: 'customer',
    // provider-specific
    category: '',
    city: '',
    bio: '',
    pricing: '',
    profileImage: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'provider') navigate('/provider-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/customer-dashboard');
    }
  }, [navigate]);

  // load categories from server
  useEffect(() => {
    axios.get(apiUrl('/api/categories'))
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data.map(c => c.name));
        }
      })
      .catch(() => {
        // ignore, keep static list
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(apiUrl('/api/users/register'), formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Redirect based on role
      const role = response.data.user.role;
      if (role === 'provider') {
        navigate('/provider-dashboard')
      } else if (role === 'admin') {
        navigate('/admin-dashboard')
      } else {
        navigate('/customer-dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-68px)] py-12 flex flex-col justify-center items-center px-4 relative z-10">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create <span className="gradient-text">Account</span>
          </h1>
          <p className="text-slate-500">Join ServiceFlow today and get started</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-600 text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-400"
                  placeholder="Subransu"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-600 text-slate-400">
                  <Phone size={10} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-400"
                  placeholder="+91 1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-600 text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-400"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-600 text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={6}
                className="block w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.role === 'customer' 
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span className="font-medium">Customer</span>
                </div>
                <input 
                  type="radio" 
                  name="role" 
                  value="customer" 
                  checked={formData.role === 'customer'} 
                  onChange={handleChange} 
                  className="hidden"
                />
                {formData.role === 'customer' && <CheckCircle size={14} className="text-blue-600" />}
              </label>

              <label 
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.role === 'provider' 
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} />
                  <span className="font-medium">Provider</span>
                </div>
                <input 
                  type="radio" 
                  name="role" 
                  value="provider" 
                  checked={formData.role === 'provider'} 
                  onChange={handleChange} 
                  className="hidden"
                />
                {formData.role === 'provider' && <CheckCircle size={14} className="text-blue-600" />}
              </label>
            </div>
          </div>

          {/* provider details */}
          {formData.role === 'provider' && (
            <div className="space-y-4 p-4 bg-blue-50/30 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-slate-900">Provider profile</h3>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Category</label>
                <select
                  name="category"
                  required
                  className="block w-full pl-3 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">City / Area</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-400"
                  placeholder="e.g. Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Hourly pricing (₹)</label>
                <input
                  type="number"
                  name="pricing"
                  required
                  min="0"
                  className="block w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-400"
                  placeholder="500"
                  value={formData.pricing}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Short bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  className="block w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-400"
                  placeholder="Describe your service expertise..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Profile image URL (optional)</label>
                <input
                  type="url"
                  name="profileImage"
                  className="block w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-400"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.profileImage}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 mt-4 text-base justify-center"
          >
            {loading ? 'Creating account...' : (
              <>
                <span>Get Started</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
