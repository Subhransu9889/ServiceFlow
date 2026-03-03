export default function SummaryCard({ icon: Icon, label, value, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-light border-blue-mid text-blue-dark',
    green: 'bg-green-light border-green-mid text-green',
    amber: 'bg-amber/10 border-amber/30 text-amber',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6 flex items-center gap-4`}>
      <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-mid text-blue-dark' : color === 'green' ? 'bg-green-mid text-green' : color === 'amber' ? 'bg-amber/20 text-amber' : 'bg-red-100 text-red-600'}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium opacity-75">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
