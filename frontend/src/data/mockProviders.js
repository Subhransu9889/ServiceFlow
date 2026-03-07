// Mock provider data and bookings for demonstration
export const mockProviderBookings = [
  {
    _id: '1',
    serviceType: 'Plumbing Service',
    categoryId: {
      _id: 'cat1',
      name: 'Plumbing'
    },
    customerId: {
      _id: 'cust1',
      name: 'Arjun Singh',
      phone: '+91 9876543210'
    },
    providerId: 'prov1',
    scheduledAt: new Date('2026-03-15T10:00:00'),
    status: 'Requested',
    address: '123 MG Road, Bangalore, India',
    priceAtBooking: 500,
    notes: 'Water pipe leakage repair needed',
    description: 'Water pipe leakage repair'
  },
  {
    _id: '2',
    serviceType: 'Electrical Service',
    categoryId: {
      _id: 'cat2',
      name: 'Electrical'
    },
    customerId: {
      _id: 'cust2',
      name: 'Priya Sharma',
      phone: '+91 9876543211'
    },
    providerId: 'prov1',
    scheduledAt: new Date('2026-03-15T14:00:00'),
    status: 'Confirmed',
    address: '456 Park Avenue, Bangalore, India',
    priceAtBooking: 800,
    notes: 'Rewiring entire kitchen area',
    description: 'Electrical rewiring'
  },
  {
    _id: '3',
    serviceType: 'Plumbing Service',
    categoryId: {
      _id: 'cat1',
      name: 'Plumbing'
    },
    customerId: {
      _id: 'cust3',
      name: 'Vikram Patel',
      phone: '+91 9876543212'
    },
    providerId: 'prov1',
    scheduledAt: new Date('2026-03-14T11:00:00'),
    status: 'In-progress',
    address: '789 Indiranagar, Bangalore, India',
    priceAtBooking: 600,
    notes: 'Bathroom plumbing fix and installation',
    description: 'Bathroom plumbing installation'
  },
  {
    _id: '4',
    serviceType: 'Cleaning Service',
    categoryId: {
      _id: 'cat3',
      name: 'Cleaning'
    },
    customerId: {
      _id: 'cust4',
      name: 'Deepak Kumar',
      phone: '+91 9876543213'
    },
    providerId: 'prov1',
    scheduledAt: new Date('2026-03-10T09:00:00'),
    status: 'Completed',
    address: '321 Whitefield, Bangalore, India',
    priceAtBooking: 1000,
    notes: 'Full house deep cleaning',
    description: 'Complete house cleaning'
  },
  {
    _id: '5',
    serviceType: 'Plumbing Service',
    categoryId: {
      _id: 'cat1',
      name: 'Plumbing'
    },
    customerId: {
      _id: 'cust5',
      name: 'Neha Gupta',
      phone: '+91 9876543214'
    },
    providerId: 'prov1',
    scheduledAt: new Date('2026-03-08T15:00:00'),
    status: 'Completed',
    address: '654 Koramangala, Bangalore, India',
    priceAtBooking: 450,
    notes: 'Tap replacement and valve repair',
    description: 'Tap and valve repair'
  }
];

export const mockProviderProfile = {
  _id: 'prov1',
  userId: 'user1',
  categoryId: 'cat1',
  category: 'Plumbing',
  city: 'Bangalore',
  bio: 'Professional plumber with 8+ years of experience in residential and commercial plumbing solutions.',
  pricing: 500,
  isAvailable: true,
  isApproved: true,
  rating: 4.8,
  reviews: 120,
  profileImage: 'https://i.pravatar.cc/150?u=plumber-pro'
};

export const mockProviderStats = {
  totalBookings: 156,
  completedJobs: 142,
  cancelledJobs: 5,
  totalEarnings: 78000,
  monthlyEarnings: 12500,
  averageRating: 4.8
};
