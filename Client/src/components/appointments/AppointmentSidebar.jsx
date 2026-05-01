import PropTypes from "prop-types";
import { Clock, Calendar, ArrowRight } from "lucide-react";

export default function AppointmentSidebar({ upcomingAppointments }) {
  const getTimeRemaining = (dateString, time) => {
    const appointmentDateTime = new Date(`${dateString}T${time}`);
    const now = new Date();
    const diff = appointmentDateTime - now;

    if (diff < 0) return "Past";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    if (minutes > 0) return `${minutes}m remaining`;
    return "Starting soon";
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
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Upcoming Appointments
        </h3>
      </div>

      {upcomingAppointments.length > 0 ? (
        <div className="space-y-4">
          {upcomingAppointments.slice(0, 5).map((appointment) => (
            <div
              key={appointment.id}
              className="p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50 border border-gray-200 dark:border-neutral-700 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {appointment.doctor.firstName[0]}
                    {appointment.doctor.lastName[0]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    Dr. {appointment.doctor.firstName}{" "}
                    {appointment.doctor.lastName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {appointment.doctor.specialty}
                  </p>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(appointment.appointmentDate)} at{" "}
                        {formatTime(appointment.appointmentTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {getTimeRemaining(
                          appointment.appointmentDate,
                          appointment.appointmentTime
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="p-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition flex-shrink-0">
                  <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                </button>
              </div>
            </div>
          ))}

          {upcomingAppointments.length > 5 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              +{upcomingAppointments.length - 5} more upcoming
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No upcoming appointments
          </p>
          <button className="mt-3 text-sm text-green-600 dark:text-green-400 hover:underline">
            Book an appointment
          </button>
        </div>
      )}
    </div>
  );
}

AppointmentSidebar.propTypes = {
  upcomingAppointments: PropTypes.array.isRequired,
};