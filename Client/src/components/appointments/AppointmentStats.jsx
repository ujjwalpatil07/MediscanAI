import PropTypes from "prop-types";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

const statCards = [
  {
    key: "total",
    label: "Total Appointments",
    icon: Calendar,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
];

export default function AppointmentStats({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats[card.key]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

AppointmentStats.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    upcoming: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
    cancelled: PropTypes.number.isRequired,
  }).isRequired,
};