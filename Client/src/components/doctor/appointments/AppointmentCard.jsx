import { useState } from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  Clock,
  Video,
  Building2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  MoreVertical,
  MessageCircle,
  FileText,
  Stethoscope,
} from "lucide-react";

const statusConfig = {
  upcoming: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-l-blue-500",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  completed: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-l-green-500",
    badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-l-red-500",
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
};

const paymentStatusConfig = {
  paid: "text-green-600 dark:text-green-400",
  pending: "text-amber-600 dark:text-amber-400",
  failed: "text-red-600 dark:text-red-400",
};

export default function AppointmentCard({ appointment }) {
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const status = statusConfig[appointment.status];
  const TypeIcon = appointment.appointmentType === "online" ? Video : Building2;

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
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

  const getPatientInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  const handleAccept = async () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      alert("Appointment accepted");
    }, 500);
  };

  const handleReject = async () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      alert("Appointment rejected");
    }, 500);
  };

  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-xl shadow-sm border-l-4 ${status.border} overflow-hidden hover:shadow-md transition-all duration-300`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {getPatientInitials(
                    appointment.patient.firstName,
                    appointment.patient.lastName
                  )}
                </span>
              </div>
              {appointment.appointmentType === "online" && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Video className="w-3 h-3 text-white" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {appointment.patient.firstName}{" "}
                  {appointment.patient.lastName}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.badge}`}
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
                <span
                  className={`text-xs font-medium ${paymentStatusConfig[appointment.paymentStatus]}`}
                >
                  • {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{appointment.patient.age} yrs</span>
                <span>•</span>
                <span>{appointment.patient.gender}</span>
              </div>

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    {appointment.appointmentType === "clinic-visit"
                      ? "Clinic Visit"
                      : "Online Consultation"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  Fee: ₹{appointment.consultationFee}
                </div>
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    View details
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>

              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-20">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Message Patient
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> View Full Details
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" /> Start Consultation
                  </button>
                </div>
              )}
            </div>

            {appointment.status === "upcoming" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition"
                  title="Accept Appointment"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                  title="Reject Appointment"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Symptoms
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {appointment.symptoms}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Contact Information
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-3 h-3" />
                    {appointment.patient.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-3 h-3" />
                    {appointment.patient.phone}
                  </div>
                </div>
              </div>
              {appointment.diagnosis && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Diagnosis
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {appointment.diagnosis}
                  </p>
                </div>
              )}
              {appointment.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Notes
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    patient: PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      gender: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }).isRequired,
    appointmentDate: PropTypes.string.isRequired,
    appointmentTime: PropTypes.string.isRequired,
    appointmentType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    consultationFee: PropTypes.number.isRequired,
    symptoms: PropTypes.string.isRequired,
    diagnosis: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
};