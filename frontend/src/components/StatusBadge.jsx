export default function StatusBadge({ status }) {
  const statusConfig = {
    requested: {
      label: 'Requested',
      bgColor: 'status-requested'
    },
    confirmed: {
      label: 'Confirmed',
      bgColor: 'status-confirmed'
    },
    'in-progress': {
      label: 'In Progress',
      bgColor: 'status-in-progress'
    },
    completed: {
      label: 'Completed',
      bgColor: 'status-completed'
    },
    cancelled: {
      label: 'Cancelled',
      bgColor: 'status-cancelled'
    }
  };

  const config = statusConfig[status] || statusConfig.requested;

  return (
    <span className={`status-badge ${config.bgColor}`}>
      {config.label}
    </span>
  );
}
