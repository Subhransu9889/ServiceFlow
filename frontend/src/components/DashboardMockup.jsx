import { Bell, Search, CheckCircle } from 'lucide-react'

const bookings = [
  {
    id: 1,
    service: 'Kitchen Leak Repair',
    provider: 'Hitesh Choudhary',
    date: 'Mar 2',
    price: '$75',
    status: 'requested',
    avatar: 'https://chaicode.com/assets/white-2-pi8ziUjj.webp',
  },
  {
    id: 2,
    service: 'Deep Home Cleaning',
    provider: 'Piyush Garg',
    date: 'Mar 3',
    price: '$120',
    status: 'confirmed',
    avatar: 'https://www.piyushgarg.dev/_next/image?url=%2Fimages%2Favatar.png&w=1080&q=75',
  },
  {
    id: 3,
    service: 'Bedroom Wall Painting',
    provider: 'Akash Kadlag',
    date: 'Mar 4',
    price: '$200',
    status: 'in-progress',
    avatar: 'https://ugc.production.linktr.ee/ea3086c6-8657-4eed-84fb-81b880cf8fba_Akash-Close-Up.png?io=true&size=avatar-v3_0',
  },
  {
    id: 4,
    service: 'AC Annual Service',
    provider: 'Anirudh Jwala',
    date: 'Feb 28',
    price: '$85',
    status: 'completed',
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQHvWcb42l_GTQ/profile-displayphoto-scale_100_100/B56Zk32xzkH8Ac-/0/1757578731945?e=1773878400&v=beta&t=H7HthB1WhQDAIQxH7S9v8hOQdkrwNx03lbVVoK6WmC0',
  },
]

const statusLabels = {
  requested: 'Requested',
  confirmed: 'Confirmed',
  'in-progress': 'In-progress',
  completed: 'Completed',
}

export default function DashboardMockup() {
  return (
    <div className="dashboard-wrapper" aria-label="Booking dashboard preview">
      {/* Rating floating card */}
      <div className="floating-card float-rating" aria-hidden="true">
        <div className="float-stars">★★★★★</div>
        <div className="float-rating-value">4.9</div>
        <div className="float-label">Average Rating</div>
        <div className="float-label" style={{ marginTop: 2 }}>
          2,400+ Reviews
        </div>
      </div>

      {/* Providers floating card */}
      <div className="floating-card float-providers" aria-hidden="true">
        <div className="float-check">
          <div className="float-check-icon">
            <CheckCircle size={15} />
          </div>
          <div>
            <div className="float-value">1,247+</div>
            <div className="float-label">Verified Providers</div>
          </div>
        </div>
      </div>

      <div className="dashboard">
        <div className="dashboard-header">
          <span className="dashboard-title">Booking Board</span>
          <div className="dashboard-actions">
            <div className="icon-btn" aria-hidden="true">
              <Search size={13} />
            </div>
            <div className="icon-btn" aria-hidden="true">
              <Bell size={13} />
            </div>
            <span className="live-pill">
              <span className="live-dot" />
              Live
            </span>
          </div>
        </div>

        <div className="booking-list">
          {bookings.map((b) => (
            <article className="booking-card" key={b.id}>
              <div className="booking-left">
                <img
                  src={b.avatar}
                  alt={b.provider}
                  className="booking-avatar"
                  width={34}
                  height={34}
                />
                <div className="booking-info">
                  <div className="booking-service">{b.service}</div>
                  <div className="booking-meta">
                    by {b.provider} &middot; {b.date}
                  </div>
                </div>
              </div>
              <div className="booking-right">
                <span className="booking-price">{b.price}</span>
                <span className={`status-badge status-${b.status}`}>
                  {statusLabels[b.status]}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="status-legend" aria-label="All booking statuses">
          <span className="status-badge status-requested">Requested</span>
          <span className="status-badge status-confirmed">Confirmed</span>
          <span className="status-badge status-in-progress">In-progress</span>
          <span className="status-badge status-completed">Completed</span>
          <span className="status-badge status-cancelled">Cancelled</span>
        </div>
      </div>
    </div>
  )
}
