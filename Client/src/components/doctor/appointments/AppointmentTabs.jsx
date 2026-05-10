import PropTypes from "prop-types";
import { Video, Building2, Clock, CheckCircle, XCircle } from "lucide-react";

const statusTabs = [
  { id: "upcoming", label: "Upcoming", icon: Clock },
  { id: "completed", label: "Completed", icon: CheckCircle },
  { id: "cancelled", label: "Cancelled", icon: XCircle },
];

const typeTabs = [
  { id: "all", label: "All Types", icon: null },
  { id: "online", label: "Video", icon: Video },
  { id: "clinic", label: "Clinic Visit", icon: Building2 },
];

function AppointmentTabs({ activeStatusTab, setActiveStatusTab, activeTypeFilter, setActiveTypeFilter }) {
  return (
    <div className="border-b border-gray-200 dark:border-neutral-700">
      <div className="flex gap-1 px-4 overflow-x-auto scrollbar-hide">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatusTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${activeStatusTab === tab.id
                ? "border-green-600 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1 px-4 py-2 bg-gray-50/50 dark:bg-neutral-800/50 overflow-x-auto scrollbar-hide">
        {typeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTypeFilter(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap ${activeTypeFilter === tab.id
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700"
              }`}
          >
            {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

AppointmentTabs.propTypes = {
  activeStatusTab: PropTypes.string.isRequired,
  setActiveStatusTab: PropTypes.func.isRequired,
  activeTypeFilter: PropTypes.string.isRequired,
  setActiveTypeFilter: PropTypes.func.isRequired,
};

export default AppointmentTabs;