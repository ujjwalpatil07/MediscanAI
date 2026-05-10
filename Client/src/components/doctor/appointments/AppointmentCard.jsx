import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Video,
  Building2,
  ChevronDown,
  ChevronUp,
  User as UserIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MapPin,
  DollarSign,
  AlertCircle,
  FileText as FileTextIcon,
  Activity,
  CheckCircle,
  XCircle,
  Send,
  Link as LinkIcon,
} from "lucide-react";
import PrescriptionModal from "../prescription/PrescriptionModal";
import { createPrescription } from "../../../services/prescription.service";

const statusConfig = {
  upcoming: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-l-blue-500",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    icon: ClockIcon,
  },
  completed: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-l-green-500",
    badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    icon: CheckCircle,
  },
  cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-l-red-500",
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    icon: XCircle,
  },
};

const paymentConfig = {
  paid: { color: "text-green-600 dark:text-green-400", icon: CheckCircle },
  pending: { color: "text-amber-600 dark:text-amber-400", icon: AlertCircle },
  failed: { color: "text-red-600 dark:text-red-400", icon: XCircle },
};

function AppointmentCard({ appointments, activeStatusTab, activeTypeFilter }) {
  const now = new Date();

  const filteredAppointments = useMemo(() => {
    let filtered = [...(appointments || [])];

    if (activeStatusTab === "upcoming") {
      filtered = filtered.filter(
        (appt) =>
          appt?.status === "upcoming" &&
          new Date(appt?.appointmentTime || appt?.appointmentDate) > now
      );
    } else if (activeStatusTab === "completed") {
      filtered = filtered.filter(
        (appt) =>
          appt?.status === "completed" ||
          (appt?.status === "upcoming" &&
            new Date(appt?.appointmentTime || appt?.appointmentDate) <= now)
      );
    } else if (activeStatusTab === "cancelled") {
      filtered = filtered.filter((appt) => appt?.status === "cancelled");
    }

    if (activeTypeFilter !== "all") {
      filtered = filtered.filter(
        (appt) => appt?.appointmentType === activeTypeFilter
      );
    }

    return filtered;
  }, [appointments, activeStatusTab, activeTypeFilter, now]);

  if (filteredAppointments.length === 0) {
    return (
      <div className="text-center py-16">
        <CalendarIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No appointments found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAppointments.map((appointment) => (
        <SingleCard key={appointment?._id} appointment={appointment} />
      ))}
    </div>
  );
}

AppointmentCard.propTypes = {
  appointments: PropTypes.array.isRequired,
  activeStatusTab: PropTypes.string.isRequired,
  activeTypeFilter: PropTypes.string.isRequired,
};

function SingleCard({ appointment }) {
  const [expanded, setExpanded] = useState(false);
  const [meetLink, setMeetLink] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  const status = statusConfig[appointment?.status] || statusConfig.upcoming;
  const StatusIcon = status.icon;
  const PaymentInfo =
    paymentConfig[appointment?.paymentStatus] || paymentConfig.pending;
  const PaymentIcon = PaymentInfo.icon;
  const TypeIcon =
    appointment?.appointmentType === "online" ? Video : Building2;

  const isTimePassed = useMemo(() => {
    if (!appointment?.appointmentTime) return false;
    return new Date(appointment.appointmentTime) <= new Date();
  }, [appointment?.appointmentTime]);

  const isCompleted =
    appointment?.status === "completed" ||
    (appointment?.status === "upcoming" && isTimePassed);
  const isUpcomingVideo =
    appointment?.status === "upcoming" &&
    !isTimePassed &&
    appointment?.appointmentType === "online";

  const patientAge = useMemo(() => {
    if (!appointment?.patient?.dob) return null;
    const dob = new Date(appointment.patient.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }, [appointment?.patient?.dob]);

  const endTime = useMemo(() => {
    if (!appointment?.appointmentTime) return null;
    const start = new Date(appointment.appointmentTime);
    if (isNaN(start.getTime())) return null;
    return new Date(start.getTime() + 30 * 60000);
  }, [appointment?.appointmentTime]);

  const fmtDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fmtTime = (d) => {
    if (!d) return "N/A";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "N/A";
    const h = date.getHours() % 12 || 12;
    const m = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${h}:${m} ${ampm}`;
  };

  const initials = `${appointment?.patient?.firstName?.[0] || "?"}${appointment?.patient?.lastName?.[0] || ""}`;

  const handleCreateMeetLink = () => {
    const meetId = Math.random().toString(36).substring(2, 12);
    setMeetLink(`https://meet.google.com/${meetId}`);
  };

  const handleSendMeetLink = () => {
    if (meetLink) {
      toast.success(`Meeting link sent to patient!`);
    }
  };

  const handleCreatePrescription = async (data) => {
    setPrescriptionLoading(true);
    try {
      const response = await createPrescription(data);
      if (response?.data?.success) {
        toast.success("Prescription created successfully!");
        setShowPrescriptionModal(false);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create prescription";
      toast.error(message);
      throw error;
    } finally {
      setPrescriptionLoading(false);
    }
  };

  return (
    <>
      <div
        className={`bg-white dark:bg-neutral-800 rounded-xl shadow-sm border-l-4 ${status.border} overflow-hidden hover:shadow-md transition-all duration-300`}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center overflow-hidden">
                  {appointment?.patient?.profilePhoto ? (
                    <img
                      src={appointment.patient.profilePhoto}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {initials}
                    </span>
                  )}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-800 ${appointment?.status === "upcoming"
                      ? "bg-green-500"
                      : appointment?.status === "completed"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {appointment?.patient?.firstName || "Unknown"}{" "}
                    {appointment?.patient?.lastName || ""}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.badge}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {appointment?.status === "upcoming" && isTimePassed
                      ? "Auto Completed"
                      : appointment?.status?.charAt(0).toUpperCase() +
                      appointment?.status?.slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${PaymentInfo.color}`}
                  >
                    <PaymentIcon className="w-3 h-3" />
                    {appointment?.paymentStatus?.charAt(0).toUpperCase() +
                      appointment?.paymentStatus?.slice(1)}
                  </span>
                </div>

                {/* Demographics */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2 flex-wrap">
                  {patientAge && (
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      {patientAge} yrs • {appointment?.patient?.gender || "N/A"}
                    </span>
                  )}
                  {appointment?.patient?.bloodGroup && (
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {appointment.patient.bloodGroup}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    Booked: {fmtDate(appointment?.createdAt)}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                    {fmtDate(appointment?.appointmentDate)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4 flex-shrink-0" />
                    {fmtTime(appointment?.appointmentTime)}
                    {endTime && ` - ${fmtTime(endTime)}`}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TypeIcon className="w-4 h-4 flex-shrink-0" />
                    {appointment?.appointmentType === "clinic"
                      ? "Clinic Visit"
                      : "Online"}
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />₹
                    {appointment?.consultationFee}
                  </div>
                  {appointment?.appointmentType === "clinic" &&
                    appointment?.patient?.address && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 col-span-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {appointment.patient.address}
                        </span>
                      </div>
                    )}
                  {meetLink && (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 col-span-2">
                      <LinkIcon className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm truncate hover:underline"
                      >
                        {meetLink}
                      </a>
                    </div>
                  )}
                </div>

                {/* Symptoms */}
                {appointment?.symptoms && (
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {appointment.symptoms}
                    </p>
                  </div>
                )}

                {/* Expand Button */}
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

            {/* Action Buttons */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              {/* Video Meet Link */}
              {isUpcomingVideo && !meetLink && (
                <button
                  onClick={handleCreateMeetLink}
                  className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center gap-1"
                >
                  <Video className="w-3.5 h-3.5" />
                  Create Meet Link
                </button>
              )}
              {isUpcomingVideo && meetLink && (
                <button
                  onClick={handleSendMeetLink}
                  className="px-3 py-1.5 text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send to Patient
                </button>
              )}

              {/* Prescription Button */}
              {isCompleted && (
                <button
                  onClick={() => setShowPrescriptionModal(true)}
                  className="px-3 py-1.5 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition flex items-center gap-1"
                >
                  <FileTextIcon className="w-3.5 h-3.5" />
                  Give Prescription
                </button>
              )}
            </div>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4" />
                      {appointment?.patient?.email || "N/A"}
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" />
                      {appointment?.patient?.mobile || "N/A"}
                    </div>
                  </div>
                  {appointment?.patient?.emergencyContact?.name && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        Emergency:{" "}
                        {appointment.patient.emergencyContact.name} (
                        {appointment.patient.emergencyContact.relation})
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {appointment.patient.emergencyContact.phone}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Medical Information
                  </h4>
                  <div className="space-y-2">
                    {appointment?.symptoms && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Symptoms
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {appointment.symptoms}
                        </p>
                      </div>
                    )}
                    {appointment?.notes && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Notes
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <PrescriptionModal
          isOpen={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          appointment={appointment}
          onSubmit={handleCreatePrescription}
          loading={prescriptionLoading}
        />
      )}
    </>
  );
}

SingleCard.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default AppointmentCard;