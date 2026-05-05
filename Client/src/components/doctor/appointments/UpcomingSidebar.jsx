import { useState } from "react";
import PropTypes from "prop-types";
import { Clock, Calendar, ChevronRight, Video, Building2 } from "lucide-react";

export default function UpcomingSidebar({ upcomingAppointments }) {
  const [showAll, setShowAll] = useState(false);
  const displayAppointments = showAll
    ? upcomingAppointments
    : upcomingAppointments.slice(0, 5);

  const formatTimeRemaining = (dateString, time) => {
    const appointmentDateTime = new Date(`${dateString}T${time}`);
    const now = new Date();
    const diff = appointmentDateTime - now;

    if (diff < 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return "Now";
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5 sticky top-20">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Upcoming
        </h3>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
          {upcomingAppointments.length}
        </span>
      </div>

      {upcomingAppointments.length > 0 ? (
        <>
          <div className="space-y-3">
            {displayAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50 border border-gray-200 dark:border-neutral-700 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {appointment.patient.firstName[0]}
                      {appointment.patient.lastName[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">
                        {appointment.patient.firstName}{" "}
                        {appointment.patient.lastName}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {appointment.appointmentType === "online" ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <Building2 className="w-3 h-3" />
                        )}
                      </span>
                    </div>

                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(appointment.appointmentDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {formatTimeRemaining(
                            appointment.appointmentDate,
                            appointment.appointmentTime
                          )}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          • {formatTime(appointment.appointmentTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition flex-shrink-0 mt-2" />
                </div>
              </div>
            ))}
          </div>

          {upcomingAppointments.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-4 text-center text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              {showAll
                ? "Show less"
                : `View all ${upcomingAppointments.length} upcoming`}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No upcoming appointments
          </p>
        </div>
      )}
    </div>
  );
}

UpcomingSidebar.propTypes = {
  upcomingAppointments: PropTypes.array.isRequired,
};