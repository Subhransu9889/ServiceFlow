import { ChevronRight, MapPin, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function BookingCard({ booking, onViewDetails, onAction, actionLabel, showAction = true }) {
  return (
    <div className="booking-card group hover:shadow-md transition-all">
      <div className="booking-left">
        <img 
          src={booking.provider.avatar} 
          alt={booking.provider.name}
          className="booking-avatar"
        />
        <div className="booking-info">
          <div className="booking-service">{booking.serviceType}</div>
          <div className="booking-meta">{booking.provider.name}</div>
          <div className="booking-meta flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {booking.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {booking.address.split(',')[0]}
            </span>
          </div>
        </div>
      </div>

      <div className="booking-right flex items-center gap-3">
        <StatusBadge status={booking.status} />
        
        {showAction && (
          <div className="flex gap-2">
            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="btn btn-ghost text-sm px-3 py-1.5 flex items-center gap-1"
              >
                View Details
                <ChevronRight size={14} />
              </button>
            )}
            {onAction && (
              <button
                onClick={onAction}
                className="btn btn-primary text-sm px-3 py-1.5"
              >
                {actionLabel || 'Action'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
