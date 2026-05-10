import PropTypes from "prop-types";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

const items = [
  { key: "total", label: "Total", icon: Calendar, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { key: "upcoming", label: "Upcoming", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { key: "completed", label: "Completed", icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
];

function AppointmentStatsCard({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.key} className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300">
            <div className={`p-2 rounded-lg ${item.bg} w-fit mb-3`}>
              <Icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.[item.key] ?? 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}

AppointmentStatsCard.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    upcoming: PropTypes.number,
    completed: PropTypes.number,
    cancelled: PropTypes.number,
  }).isRequired,
};

export default AppointmentStatsCard;