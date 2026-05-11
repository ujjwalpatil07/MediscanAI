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
    BookOpen,
    Stethoscope,
    DollarSign,
    User as UserIcon,
    Clock as ClockIcon,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    SlidersHorizontal,
    Eye,
    Loader2
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import {
    getMyAppointmentsService,
    cancelAppointmentService,
    getAppointmentByIdService
} from "../../services/appointment.service";
import toast from "react-hot-toast";
import MedicalBackground from "../../components/common/MedicalBackground";

const statusConfig = {
    upcoming: {
        label: "Upcoming",
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
        icon: ClockIcon,
        gradient: "from-emerald-500 to-teal-500"
    },
    completed: {
        label: "Completed",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        icon: CheckCircle,
        gradient: "from-blue-500 to-cyan-500"
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        icon: X,
        gradient: "from-red-500 to-rose-500"
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
    const [showFilters, setShowFilters] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const userId = loginUser?._id;

    useEffect(() => {
        fetchAppointments();
    }, [userId]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await getMyAppointmentsService();

            if (response.data.success) {
                setAppointments(response.data.appointments || []);
            } else {
                toast.error("Failed to load appointments");
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
            toast.error(error.response?.data?.message || "Failed to load appointments");
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async () => {
        if (!showCancelModal) return;

        setCancelling(true);
        try {
            const response = await cancelAppointmentService(showCancelModal._id);

            if (response.data.success) {
                toast.success("Appointment cancelled successfully");

                // Update local state
                setAppointments(prev =>
                    prev.map(apt =>
                        apt._id === showCancelModal._id
                            ? { ...apt, status: "cancelled" }
                            : apt
                    )
                );
                setShowCancelModal(null);
            } else {
                toast.error(response.data.message || "Failed to cancel appointment");
            }
        } catch (error) {
            console.error("Failed to cancel appointment:", error);
            toast.error(error.response?.data?.message || "Failed to cancel appointment");
        } finally {
            setCancelling(false);
        }
    };

    const handleViewDetails = async (appointment) => {
        try {
            const response = await getAppointmentByIdService(appointment._id);
            if (response.data.success) {
                setSelectedAppointment(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch appointment details:", error);
            toast.error("Failed to load appointment details");
        }
    };

    const handleBookAgain = (doctorId) => {
        const id = doctorId?._id || doctorId;
        navigate(`/p/book-appointment/${id}`);
    };

    const filteredAppointments = useMemo(() => {
        let filtered = appointments.filter(
            (apt) => apt?.status === activeTab
        );

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

        if (typeFilter !== "all") {
            filtered = filtered.filter(
                (apt) => apt?.appointmentType === typeFilter
            );
        }

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

    const getCountByStatus = (status) => {
        return appointments.filter((apt) => apt?.status === status).length;
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

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

    const getDoctorName = (appointment) => {
        if (appointment?.doctorSnapshot?.name) {
            return appointment.doctorSnapshot.name;
        }
        const firstName = appointment?.doctorId?.firstName || "";
        const lastName = appointment?.doctorId?.lastName || "";
        return `Dr. ${firstName} ${lastName}`.trim();
    };

    const getDoctorImage = (appointment) => {
        return (
            appointment?.doctorSnapshot?.image ||
            appointment?.doctorId?.profilePhoto ||
            null
        );
    };

    const getDoctorSpecialty = (appointment) => {
        return (
            appointment?.doctorSnapshot?.specialty ||
            appointment?.doctorId?.specialty ||
            "Specialty not specified"
        );
    };

    const getAppointmentTypeIcon = (type) => {
        switch (type) {
            case "video":
                return <Video className="w-4 h-4" />;
            case "clinic":
                return <MapPin className="w-4 h-4 text-emerald-500" />;
            default:
                return <Stethoscope className="w-4 h-4" />;
        }
    };

    const getAppointmentTypeLabel = (type) => {
        switch (type) {
            case "video":
                return "Video Consultation";
            case "clinic":
                return "Clinic Visit";
            default:
                return type || "Consultation";
        }
    };

    const canCancel = (appointment) => {
        if (appointment.status !== "upcoming") return false;
        const appointmentDate = new Date(appointment.appointmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointmentDate >= today;
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n?.[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const StatCard = ({ count, label, color, icon: Icon }) => (
        <div className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold">{count}</p>
                    <p className="text-sm opacity-90 mt-1">{label}</p>
                </div>
                <Icon className="w-8 h-8 opacity-80" />
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen mb-5">
            <MedicalBackground/>
            {/* Animated Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm mb-4">
                            <Calendar className="w-4 h-4" />
                            <span>Manage Your Healthcare Journey</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            My Appointments
                        </h1>
                        <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                            Track, manage, and stay on top of your medical consultations
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {/* Enhanced Search and Filter Bar */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by doctor name, specialty, or symptoms..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                                {(typeFilter !== "all") && (
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                )}
                            </button>

                            {(searchQuery || typeFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setTypeFilter("all");
                                    }}
                                    className="px-5 py-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Appointment Type
                                    </label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="video">Video Consultation</option>
                                        <option value="clinic">Clinic Visit</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modern Tabs */}
                <div className="flex gap-2 mb-8 bg-white dark:bg-neutral-900 rounded-2xl p-2 shadow-sm border border-neutral-200 dark:border-neutral-800">
                    {["upcoming", "completed", "cancelled"].map((tab) => {
                        const Icon = statusConfig[tab]?.icon;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab
                                    ? `bg-gradient-to-r ${statusConfig[tab].gradient} text-white shadow-lg`
                                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    }`}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab
                                    ? "bg-white/20 text-white"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                                    }`}>
                                    {getCountByStatus(tab)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block">
                            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-4 text-neutral-500 dark:text-neutral-400">
                            Loading your appointments...
                        </p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    /* Enhanced Empty State */
                    <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                            No {activeTab} appointments found
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                            {searchQuery || typeFilter !== "all"
                                ? "Try adjusting your search or filters to find what you're looking for"
                                : `You don't have any ${activeTab} appointments yet`}
                        </p>
                        {activeTab === "upcoming" && (
                            <Link
                                to="/doctors"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                            >
                                Browse Doctors <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                ) : (
                    /* Modern Appointments Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredAppointments.map((appointment) => (
                            <div
                                key={appointment?._id}
                                className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:-translate-y-1 h-fit"
                            >
                                {/* Gradient Top Bar */}
                                <div className={`h-1 bg-gradient-to-r ${statusConfig[appointment?.status]?.gradient}`}></div>

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex gap-4 mb-4">
                                        {/* Doctor Avatar with Ring */}
                                        <div className="relative">
                                            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${statusConfig[appointment?.status]?.gradient} opacity-75 blur-md group-hover:opacity-100 transition-opacity`}></div>
                                            {getDoctorImage(appointment) ? (
                                                <img
                                                    src={getDoctorImage(appointment)}
                                                    alt={getDoctorName(appointment)}
                                                    className="relative w-20 h-20 rounded-full object-cover border-4 border-white dark:border-neutral-800"
                                                />
                                            ) : (
                                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center border-4 border-white dark:border-neutral-800">
                                                    <span className="text-2xl font-bold text-white">
                                                        {getInitials(getDoctorName(appointment))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col">
                                                <h3 className="font-bold text-xl text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {getDoctorName(appointment)}
                                                </h3>
                                                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 mt-1">
                                                    <Stethoscope className="w-3 h-3" />
                                                    {getDoctorSpecialty(appointment)}
                                                </p>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="mt-2">
                                                <div
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[appointment?.status]?.color} flex items-center gap-1`}
                                                >
                                                    {statusConfig[appointment?.status]?.icon &&
                                                        React.createElement(statusConfig[appointment?.status].icon, { className: "w-3 h-3" })
                                                    }
                                                    {statusConfig[appointment?.status]?.label}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Family Member Badge */}
                                    {appointment?.patientDetails?.relation !== "self" &&
                                        appointment?.patientDetails?.name && (
                                            <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                                        <span className="font-semibold">Booking for:</span>{" "}
                                                        {appointment.patientDetails.name}
                                                        {appointment?.patientDetails?.age &&
                                                            ` (${appointment.patientDetails.age} years)`}
                                                        {appointment?.patientDetails?.gender &&
                                                            `, ${appointment.patientDetails.gender}`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                    {/* Appointment Details Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/50 border border-gray-400/20">
                                            <CalendarIcon className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Date</p>
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {formatDisplayDate(appointment?.appointmentDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/50 border border-gray-400/20">
                                            <Clock className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Time</p>
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {formatTime(appointment?.startTime, appointment?.endTime)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/50 border border-gray-400/20">
                                            {getAppointmentTypeIcon(appointment?.appointmentType)}
                                            <div>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Type</p>
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {getAppointmentTypeLabel(appointment?.appointmentType)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/50 border border-gray-400/20">
                                            <DollarSign className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Fee</p>
                                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                    ₹{appointment?.consultationFee || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Symptoms Section */}
                                    {appointment?.symptoms && (
                                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-1">Symptoms / Reason</p>
                                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                                {appointment.symptoms}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => handleViewDetails(appointment)}
                                            className="flex-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>

                                        {appointment?.status === "upcoming" && canCancel(appointment) && (
                                            <button
                                                onClick={() => setShowCancelModal(appointment)}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        )}

                                        {appointment?.status === "completed" && (
                                            <button
                                                onClick={() => handleBookAgain(appointment?.doctorId)}
                                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                                            >
                                                <BookOpen className="w-4 h-4" />
                                                Book Again
                                            </button>
                                        )}

                                        {appointment?.status === "cancelled" && (
                                            <button
                                                onClick={() => handleBookAgain(appointment?.doctorId)}
                                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105"
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

            {/* Enhanced Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center mb-4">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                Cancel Appointment
                            </h3>
                        </div>

                        <p className="text-neutral-600 dark:text-neutral-400 text-center mb-4">
                            Are you sure you want to cancel your appointment with{" "}
                            <span className="font-semibold text-neutral-900 dark:text-white">
                                {getDoctorName(showCancelModal)}
                            </span>?
                        </p>

                        {showCancelModal?.patientDetails?.relation !== "self" &&
                            showCancelModal?.patientDetails?.name && (
                                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                    <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
                                        ⚠️ This appointment was booked for {showCancelModal.patientDetails.name}
                                    </p>
                                </div>
                            )}

                        <p className="text-sm text-neutral-500 dark:text-neutral-500 text-center mb-6">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(null)}
                                disabled={cancelling}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all disabled:opacity-50"
                            >
                                Keep Appointment
                            </button>
                            <button
                                onClick={handleCancelAppointment}
                                disabled={cancelling}
                                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {cancelling ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    "Yes, Cancel"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className={`h-2 bg-gradient-to-r ${statusConfig[selectedAppointment?.status]?.gradient}`}></div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Appointment Details
                                </h2>
                                <button
                                    onClick={() => setSelectedAppointment(null)}
                                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>

                            {/* Doctor Info */}
                            <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                                {getDoctorImage(selectedAppointment) ? (
                                    <img
                                        src={getDoctorImage(selectedAppointment)}
                                        alt={getDoctorName(selectedAppointment)}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                        <span className="text-xl font-bold text-white">
                                            {getInitials(getDoctorName(selectedAppointment))}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                                        {getDoctorName(selectedAppointment)}
                                    </h3>
                                    <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                                        {getDoctorSpecialty(selectedAppointment)}
                                    </p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Appointment ID</p>
                                    <p className="text-sm font-mono text-neutral-900 dark:text-white">
                                        {selectedAppointment._id.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Status</p>
                                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[selectedAppointment?.status]?.color}`}>
                                        {statusConfig[selectedAppointment?.status]?.label}
                                    </div>
                                </div>
                                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Date</p>
                                    <p className="text-sm text-neutral-900 dark:text-white">
                                        {formatDisplayDate(selectedAppointment.appointmentDate)}
                                    </p>
                                </div>
                                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Time</p>
                                    <p className="text-sm text-neutral-900 dark:text-white">
                                        {formatTime(selectedAppointment.startTime, selectedAppointment.endTime)}
                                    </p>
                                </div>
                                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Type</p>
                                    <div className="flex items-center gap-2">
                                        {getAppointmentTypeIcon(selectedAppointment.appointmentType)}
                                        <span className="text-sm text-neutral-900 dark:text-white">
                                            {getAppointmentTypeLabel(selectedAppointment.appointmentType)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Consultation Fee</p>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                        ₹{selectedAppointment.consultationFee}
                                    </p>
                                </div>
                            </div>

                            {/* Patient Details */}
                            {selectedAppointment.patientDetails && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Patient Information</h4>
                                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                            <span className="font-medium">Name:</span> {selectedAppointment.patientDetails.name}
                                        </p>
                                        {selectedAppointment.patientDetails.age && (
                                            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                                                <span className="font-medium">Age:</span> {selectedAppointment.patientDetails.age} years
                                            </p>
                                        )}
                                        {selectedAppointment.patientDetails.gender && (
                                            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                                                <span className="font-medium">Gender:</span> {selectedAppointment.patientDetails.gender}
                                            </p>
                                        )}
                                        {selectedAppointment.patientDetails.relation && selectedAppointment.patientDetails.relation !== "self" && (
                                            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                                                <span className="font-medium">Relation:</span> {selectedAppointment.patientDetails.relation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Symptoms */}
                            {selectedAppointment.symptoms && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Symptoms / Reason</h4>
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                            {selectedAppointment.symptoms}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setSelectedAppointment(null)}
                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                                >
                                    Close
                                </button>
                                {selectedAppointment.status === "upcoming" && canCancel(selectedAppointment) && (
                                    <button
                                        onClick={() => {
                                            setSelectedAppointment(null);
                                            setShowCancelModal(selectedAppointment);
                                        }}
                                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 rounded-xl font-semibold transition-all"
                                    >
                                        Cancel Appointment
                                    </button>
                                )}
                                {(selectedAppointment.status === "completed" || selectedAppointment.status === "cancelled") && (
                                    <button
                                        onClick={() => {
                                            setSelectedAppointment(null);
                                            handleBookAgain(selectedAppointment.doctorId);
                                        }}
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold transition-all"
                                    >
                                        Book Again
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}