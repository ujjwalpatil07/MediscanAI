import React, { useState, useMemo, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Calendar,
    Clock,
    Video,
    MapPin,
    X,
    Calendar as CalendarIcon,
    Search,
    ChevronRight,
    Star,
    FileText,
    BookOpen,
    Stethoscope,
    DollarSign,
    User as UserIcon,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { getMyAppointmentsService } from "../../services/appointment.service";

const statusConfig = {
    upcoming: {
        label: "Upcoming",
        color:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
    },
    completed: {
        label: "Completed",
        color:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
    },
};

export default function MyAppointmentsPage() {
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [showCancelModal, setShowCancelModal] = useState(null);

    const userId = loginUser?._id;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getMyAppointmentsService(userId);
                setAppointments(response?.data?.appointments || []);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    // Filter and sort appointments
    const filteredAppointments = useMemo(() => {
        let filtered = appointments.filter(
            (apt) => apt?.status === activeTab
        );

        // Search by doctor name or symptoms
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (apt) =>
                    apt?.doctorSnapshot?.name?.toLowerCase().includes(search) ||
                    apt?.doctorId?.firstName?.toLowerCase().includes(search) ||
                    apt?.doctorId?.lastName?.toLowerCase().includes(search) ||
                    apt?.symptoms?.toLowerCase().includes(search) ||
                    apt?.patientDetails?.name?.toLowerCase().includes(search)
            );
        }

        // Filter by appointment type
        if (typeFilter !== "all") {
            filtered = filtered.filter(
                (apt) => apt?.appointmentType === typeFilter
            );
        }

        // Sort appointments
        if (activeTab === "upcoming") {
            filtered.sort(
                (a, b) => new Date(a?.appointmentDate) - new Date(b?.appointmentDate)
            );
        } else {
            filtered.sort(
                (a, b) => new Date(b?.appointmentDate) - new Date(a?.appointmentDate)
            );
        }

        return filtered;
    }, [appointments, activeTab, searchQuery, typeFilter]);

    // Get counts for tabs
    const getCountByStatus = (status) => {
        return appointments.filter((apt) => apt?.status === status).length;
    };

    // Cancel appointment
    const handleCancelAppointment = async () => {
        if (showCancelModal) {
            try {
                // TODO: Call API to cancel appointment
                // await cancelAppointmentService(showCancelModal._id);

                setAppointments((prev) =>
                    prev.map((apt) =>
                        apt?._id === showCancelModal?._id
                            ? { ...apt, status: "cancelled" }
                            : apt
                    )
                );
                alert(
                    `Appointment with ${showCancelModal?.doctorSnapshot?.name || showCancelModal?.doctorId?.firstName} has been cancelled.`
                );
            } catch (error) {
                console.error("Failed to cancel appointment:", error);
            }
            setShowCancelModal(null);
        }
    };

    // Book again
    const handleBookAgain = (doctorId) => {
        const id = doctorId?._id || doctorId;
        navigate(`/p/book-appointment/${id}`);
    };

    // Format date for display
    const formatDisplayDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Format time from ISO date
    const formatTime = (startTime, endTime) => {
        if (!startTime) return "N/A";
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : null;

        const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

        if (end) {
            return `${start.toLocaleTimeString("en-US", timeOptions)} - ${end.toLocaleTimeString("en-US", timeOptions)}`;
        }
        return start.toLocaleTimeString("en-US", timeOptions);
    };

    // Get doctor name
    const getDoctorName = (appointment) => {
        if (appointment?.doctorSnapshot?.name) {
            return appointment.doctorSnapshot.name;
        }
        const firstName = appointment?.doctorId?.firstName || "";
        const lastName = appointment?.doctorId?.lastName || "";
        return `Dr. ${firstName} ${lastName}`.trim();
    };

    // Get doctor image
    const getDoctorImage = (appointment) => {
        return (
            appointment?.doctorSnapshot?.image ||
            appointment?.doctorId?.profilePhoto ||
            null
        );
    };

    // Get doctor specialty
    const getDoctorSpecialty = (appointment) => {
        return (
            appointment?.doctorSnapshot?.specialty ||
            appointment?.doctorId?.specialty ||
            "Specialty not specified"
        );
    };

    // Get doctor rating
    const getDoctorRating = (appointment) => {
        return appointment?.doctorSnapshot?.rating ?? 0;
    };

    // Get appointment type label
    const getAppointmentTypeLabel = (type) => {
        switch (type) {
            case "video":
                return "Video Consultation";
            case "clinic":
                return "Clinic Visit";
            case "online":
                return "Online Consultation";
            default:
                return type || "Consultation";
        }
    };

    // Check if appointment is today or future
    const isTodayOrFuture = (dateString) => {
        if (!dateString) return false;
        const appointmentDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointmentDate >= today;
    };

    // Get initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n?.[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-700 dark:from-green-900 dark:to-neutral-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
                        My Appointments
                    </h1>
                    <p className="text-green-100 text-center mt-2">
                        Manage your upcoming and past consultations
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by doctor name or symptoms..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Types</option>
                            <option value="video">Video Consultation</option>
                            <option value="clinic">Clinic Visit</option>
                            <option value="online">Online Consultation</option>
                        </select>

                        {(searchQuery || typeFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setTypeFilter("all");
                                }}
                                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                    {["upcoming", "completed", "cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-semibold transition-all relative ${activeTab === tab
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span
                                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                {getCountByStatus(tab)}
                            </span>
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Loading your appointments...
                        </p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No appointments found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {searchQuery || typeFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : `You don't have any ${activeTab} appointments`}
                        </p>
                        <Link
                            to="/doctors"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                        >
                            Book Appointment <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    /* Appointments Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredAppointments.map((appointment) => (
                            <div
                                key={appointment?._id}
                                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${statusConfig[appointment?.status]?.border || "border-gray-200"
                                    }`}
                            >
                                <div className="p-5">
                                    {/* Header with Doctor Info */}
                                    <div className="flex gap-4">
                                        {/* Doctor Image / Avatar */}
                                        {getDoctorImage(appointment) ? (
                                            <img
                                                src={getDoctorImage(appointment)}
                                                alt={getDoctorName(appointment)}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                    {getInitials(getDoctorName(appointment))}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                        {getDoctorName(appointment)}
                                                    </h3>
                                                    <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1">
                                                        <Stethoscope className="w-3 h-3" />
                                                        {getDoctorSpecialty(appointment)}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[appointment?.status]?.color || ""
                                                        }`}
                                                >
                                                    {statusConfig[appointment?.status]?.label ||
                                                        appointment?.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {getDoctorRating(appointment)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Patient Info - For family member bookings */}
                                    {appointment?.patientDetails?.relation !== "self" &&
                                        appointment?.patientDetails?.name && (
                                            <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                <p className="text-xs text-green-700 dark:text-green-300">
                                                    <span className="font-medium">Booking for:</span>{" "}
                                                    {appointment.patientDetails.name}
                                                    {appointment?.patientDetails?.age &&
                                                        ` (${appointment.patientDetails.age} years)`}
                                                    {appointment?.patientDetails?.gender &&
                                                        `, ${appointment.patientDetails.gender}`}
                                                </p>
                                            </div>
                                        )}

                                    {/* Appointment Details */}
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>
                                                {formatDisplayDate(appointment?.appointmentDate)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {formatTime(
                                                    appointment?.startTime,
                                                    appointment?.endTime
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            {appointment?.appointmentType === "video" ? (
                                                <Video className="w-4 h-4" />
                                            ) : (
                                                <MapPin className="w-4 h-4" />
                                            )}
                                            <span>
                                                {getAppointmentTypeLabel(
                                                    appointment?.appointmentType
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <DollarSign className="w-4 h-4" />
                                            <span>₹{appointment?.consultationFee || 0}</span>
                                        </div>
                                    </div>

                                    {/* Payment Status */}
                                    {appointment?.payment?.status && (
                                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                <span className="font-medium">Payment:</span>{" "}
                                                <span className="capitalize">
                                                    {appointment.payment.status}
                                                </span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Symptoms */}
                                    {appointment?.symptoms && (
                                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                <span className="font-medium">Symptoms:</span>{" "}
                                                {appointment.symptoms}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {appointment?.status === "upcoming" && (
                                            <>
                                                {appointment?.appointmentType === "video" &&
                                                    isTodayOrFuture(appointment?.appointmentDate) && (
                                                        <button
                                                            onClick={() =>
                                                                alert("Video call feature coming soon!")
                                                            }
                                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                                        >
                                                            <Video className="w-4 h-4" />
                                                            Join Call
                                                        </button>
                                                    )}
                                                <button
                                                    onClick={() => setShowCancelModal(appointment)}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            </>
                                        )}

                                        {appointment?.status === "completed" && (
                                            <>
                                                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                                                    <FileText className="w-4 h-4" />
                                                    View Summary
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleBookAgain(appointment?.doctorId)
                                                    }
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                    Book Again
                                                </button>
                                            </>
                                        )}

                                        {appointment?.status === "cancelled" && (
                                            <button
                                                onClick={() =>
                                                    handleBookAgain(appointment?.doctorId)
                                                }
                                                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                            >
                                                <BookOpen className="w-4 h-4" />
                                                Book Again
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Cancel Appointment
                            </h3>
                            <button
                                onClick={() => setShowCancelModal(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Are you sure you want to cancel your appointment with{" "}
                            <strong>{getDoctorName(showCancelModal)}</strong>?
                        </p>
                        {showCancelModal?.patientDetails?.relation !== "self" &&
                            showCancelModal?.patientDetails?.name && (
                                <p className="text-sm text-orange-600 dark:text-orange-400 mb-2">
                                    Note: This appointment was booked for{" "}
                                    {showCancelModal.patientDetails.name}.
                                </p>
                            )}
                        <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(null)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Keep Appointment
                            </button>
                            <button
                                onClick={handleCancelAppointment}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}