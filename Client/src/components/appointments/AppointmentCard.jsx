import PropTypes from "prop-types";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  User,
  MapPin,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";

const statusColors = {
  upcoming: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  completed: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
  rescheduled: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
  },
};

const paymentStatusColors = {
  paid: "text-green-600 dark:text-green-400",
  pending: "text-yellow-600 dark:text-yellow-400",
  refunded: "text-purple-600 dark:text-purple-400",
  failed: "text-red-600 dark:text-red-400",
};

const appointmentTypeIcons = {
  video: Video,
  phone: Phone,
  "in-person": User,
};

export default function AppointmentCard({ appointment }) {
  const [showActions, setShowActions] = useState(false);
  const status = statusColors[appointment.status] || statusColors.upcoming;
  const TypeIcon = appointmentTypeIcons[appointment.appointmentType] || User;

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isPastAppointment = (date, time) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    return appointmentDateTime < new Date();
  };

  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-xl shadow-sm border-l-4 ${status.border} p-5 hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full ${status.bg} flex items-center justify-center flex-shrink-0`}
          >
            {appointment.doctor.avatar ? (
              <img
                src={appointment.doctor.avatar}
                alt={`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span
                className={`text-lg font-semibold ${status.text}`}
              >
                {appointment.doctor.firstName[0]}
                {appointment.doctor.lastName[0]}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {appointment.doctor.specialty}
            </p>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatDate(appointment.appointmentDate)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{formatTime(appointment.appointmentTime)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <TypeIcon className="w-4 h-4 flex-shrink-0" />
                <span className="capitalize">
                  {appointment.appointmentType === "in-person"
                    ? "In Person"
                    : appointment.appointmentType}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Fee:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  ₹{appointment.consultationFee}
                </span>
              </span>

              <span
                className={`text-xs font-medium ${paymentStatusColors[appointment.paymentStatus]}`}
              >
                Payment:{" "}
                {appointment.paymentStatus.charAt(0).toUpperCase() +
                  appointment.paymentStatus.slice(1)}
              </span>
            </div>

            {appointment.symptoms && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Symptoms:{" "}
                  <span className="text-gray-700 dark:text-gray-300">
                    {appointment.symptoms}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-10">
              {appointment.status === "upcoming" && (
                <>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700">
                    Reschedule
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-neutral-700">
                    Cancel Appointment
                  </button>
                </>
              )}
              {appointment.status === "completed" && (
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700">
                  View Prescription
                </button>
              )}
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700">
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    doctor: PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      specialty: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    appointmentDate: PropTypes.string.isRequired,
    appointmentTime: PropTypes.string.isRequired,
    appointmentType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    consultationFee: PropTypes.number.isRequired,
    symptoms: PropTypes.string,
  }).isRequired,
};