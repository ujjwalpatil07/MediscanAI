import PropTypes from "prop-types";
import { Users, Activity, AlertCircle, Calendar, TrendingUp, Clock } from "lucide-react";

export default function PatientStatsCard({ stats }) {
  const statItems = [
    {
      label: "Total Patients",
      value: stats.total,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      change: "+8%",
    },
    {
      label: "In Treatment",
      value: stats.inTreatment,
      icon: Activity,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Out Patients",
      value: stats.outPatient,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Upcoming Appointments",
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
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
              {item.change && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  {item.change}
                </span>
              )}
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

PatientStatsCard.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    inTreatment: PropTypes.number.isRequired,
    outPatient: PropTypes.number.isRequired,
    upcomingAppointments: PropTypes.number.isRequired,
  }).isRequired,
};