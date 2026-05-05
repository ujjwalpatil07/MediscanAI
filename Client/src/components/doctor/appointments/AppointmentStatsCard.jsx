import PropTypes from "prop-types";
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

export default function AppointmentStatsCard({ stats }) {
  const statItems = [
    {
      label: "Total Appointments",
      value: stats.total,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      change: "+12%",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      change: "+8%",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      change: "+15%",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
      change: "-3%",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                <TrendingUp className="w-3 h-3" />
                {item.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

AppointmentStatsCard.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    upcoming: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
    cancelled: PropTypes.number.isRequired,
  }).isRequired,
};