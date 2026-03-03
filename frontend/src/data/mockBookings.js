// Mock booking data for demonstration
export const mockBookings = [
  {
    id: 1,
    serviceType: 'Plumbing Service',
    provider: {
      id: 101,
      name: 'Raj Plumbing',
      rating: 4.8,
      avatar: 'https://i.pravatar.cc/150?u=raj-plumbing'
    },
    customer: {
      id: 201,
      name: 'Rohan Kumar',
      phone: '+91 9876543210',
      avatar: 'https://i.pravatar.cc/150?u=rohan-kumar'
    },
    date: '2026-03-12',
    time: '10:00 AM',
    status: 'confirmed', // requested, confirmed, in-progress, completed, cancelled
    address: '123 Main Street, Bangalore, India',
    price: 500,
    description: 'Water pipe leakage repair',
    notes: 'Bring tools for fixing water leaks',
    images: {
      before: null,
      after: null
    }
  },
  {
    id: 2,
    serviceType: 'Cleaning Service',
    provider: {
      id: 102,
      name: 'Clean Pros',
      rating: 4.9,
      avatar: 'https://i.pravatar.cc/150?u=clean-pros'
    },
    customer: {
      id: 201,
      name: 'Rohan Kumar',
      phone: '+91 9876543210',
      avatar: 'https://i.pravatar.cc/150?u=rohan-kumar'
    },
    date: '2026-03-14',
    time: '2:00 PM',
    status: 'in-progress',
    address: '456 Park Avenue, Bangalore, India',
    price: 800,
    description: 'Full house cleaning',
    notes: 'Please clean windows and carpets',
    images: {
      before: null,
      after: null
    }
  },
  {
    id: 3,
    serviceType: 'Electrical Repair',
    provider: {
      id: 103,
      name: 'Electric Experts',
      rating: 4.7,
      avatar: 'https://i.pravatar.cc/150?u=electric-experts'
    },
    customer: {
      id: 201,
      name: 'Rohan Kumar',
      phone: '+91 9876543210',
      avatar: 'https://i.pravatar.cc/150?u=rohan-kumar'
    },
    date: '2026-03-05',
    time: '11:00 AM',
    status: 'completed',
    address: '789 Circuit Lane, Bangalore, India',
    price: 400,
    description: 'Wall socket installation',
    notes: 'Install 2 new wall sockets',
    images: {
      before: 'https://picsum.photos/300/200?random=1',
      after: 'https://picsum.photos/300/200?random=2'
    }
  },
  {
    id: 4,
    serviceType: 'AC Repair',
    provider: {
      id: 104,
      name: 'Cool Masters',
      rating: 4.6,
      avatar: 'https://i.pravatar.cc/150?u=cool-masters'
    },
    customer: {
      id: 202,
      name: 'Priya Singh',
      phone: '+91 9876543211',
      avatar: 'https://i.pravatar.cc/150?u=priya-singh'
    },
    date: '2026-03-11',
    time: '9:00 AM',
    status: 'requested',
    address: '321 Cool Street, Bangalore, India',
    price: 1200,
    description: 'AC compressor replacement',
    notes: 'Compressor needs replacement',
    images: {
      before: null,
      after: null
    }
  },
  {
    id: 5,
    serviceType: 'Painting Service',
    provider: {
      id: 105,
      name: 'Paint Perfection',
      rating: 4.5,
      avatar: 'https://i.pravatar.cc/150?u=paint-perfection'
    },
    customer: {
      id: 201,
      name: 'Rohan Kumar',
      phone: '+91 9876543210',
      avatar: 'https://i.pravatar.cc/150?u=rohan-kumar'
    },
    date: '2026-03-20',
    time: '8:00 AM',
    status: 'requested',
    address: '654 Color Lane, Bangalore, India',
    price: 2000,
    description: 'Interior wall painting',
    notes: 'Paint all walls with white color',
    images: {
      before: null,
      after: null
    }
  }
];
