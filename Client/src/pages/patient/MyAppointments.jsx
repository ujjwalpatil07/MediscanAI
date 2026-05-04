import React, { useState, useMemo, useEffect } from "react";
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
    User as UserIcon
} from "lucide-react";
import { dummyAppointments } from "../../utils/data";
import { usePatientContext } from "../../context/PatientContext";


const statusConfig = {
    upcoming: {
        label: "Upcoming",
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        border: "border-green-200 dark:border-green-800"
    },
    completed: {
        label: "Completed",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800"
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        border: "border-red-200 dark:border-red-800"
    }
};

export default function MyAppointmentsPage() {
    const navigate = useNavigate();

    const { loginPatient } = usePatientContext(); 

    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [showCancelModal, setShowCancelModal] = useState(null);

    const userId = loginPatient?._id;

    // Load appointments
    useEffect(() => {
        // Simulate API call - filter by userId
        const userAppointments = dummyAppointments.filter(apt => apt.userId === userId);
        setAppointments(userAppointments);
    }, [userId]);

    // Filter and sort appointments
    const filteredAppointments = useMemo(() => {
        let filtered = appointments.filter(apt => apt.status === activeTab);

        // Search by doctor name or patient name
        if (searchQuery) {
            filtered = filtered.filter(apt =>
                apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by appointment type
        if (typeFilter !== "all") {
            filtered = filtered.filter(apt => apt.appointmentType === typeFilter);
        }

        // Sort appointments
        if (activeTab === "upcoming") {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        return filtered;
    }, [appointments, activeTab, searchQuery, typeFilter]);

    // Get counts for tabs
    const getCountByStatus = (status) => {
        return appointments.filter(apt => apt.status === status).length;
    };

    // Cancel appointment
    const handleCancelAppointment = () => {
        if (showCancelModal) {
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === showCancelModal.id
                        ? { ...apt, status: "cancelled" }
                        : apt
                )
            );
            setShowCancelModal(null);
            alert(`Appointment with ${showCancelModal.doctorName} has been cancelled.`);
        }
    };

    // Join video call
    const handleJoinCall = (appointment) => {
        if (appointment.meetingLink) {
            window.open(appointment.meetingLink, "_blank");
        } else {
            alert("Joining video call...\nThis feature will be available soon.");
        }
    };

    // Book again
    const handleBookAgain = (doctorId) => {
        navigate(`/doctors/${doctorId}`);
    };

    // View summary
    const handleViewSummary = (appointment) => {
        alert(`Appointment Summary:\n\nDoctor: ${appointment.doctorName}\nSpecialty: ${appointment.specialty}\nPatient: ${appointment.patientName || "Self"}\nDate: ${appointment.date}\nTime: ${appointment.time}\nSymptoms: ${appointment.symptoms}\nFee: ₹${appointment.consultationFee}`);
    };

    // Format date for display
    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    // Check if appointment is today or future
    const isTodayOrFuture = (dateString) => {
        const appointmentDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointmentDate >= today;
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] dark:text-gray-300 mb-3">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-700 dark:from-[#0a2a2a] dark:to-[#063333] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">My Appointments</h1>
                    <p className="text-green-100 text-center mt-2">Manage your upcoming and past consultations</p>
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
                            placeholder="Search by doctor or patient name..."
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
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                }`}>
                                {getCountByStatus(tab)}
                            </span>
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Appointments Grid */}
                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No appointments found</h3>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className={`bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${statusConfig[appointment.status].border
                                    }`}
                            >
                                <div className="p-5">
                                    {/* Header with Doctor Info */}
                                    <div className="flex gap-4">
                                        <img
                                            src={appointment.doctorImage}
                                            alt={appointment.doctorName}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                        {appointment.doctorName}
                                                    </h3>
                                                    <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1">
                                                        <Stethoscope className="w-3 h-3" />
                                                        {appointment.specialty}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[appointment.status].color}`}>
                                                    {statusConfig[appointment.status].label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{appointment.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Patient Info - For family member bookings */}
                                    {appointment.patientName && appointment.patientName !== `${loginPatient?.firstName} ${loginPatient?.lastName}` && (
                                        <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2">
                                            <UserIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <p className="text-xs text-green-700 dark:text-green-300">
                                                <span className="font-medium">Booking for:</span> {appointment.patientName} 
                                                {appointment.patientAge && ` (${appointment.patientAge} years)`}
                                                {appointment.patientGender && `, ${appointment.patientGender}`}
                                            </p>
                                        </div>
                                    )}

                                    {/* Appointment Details */}
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>{formatDisplayDate(appointment.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span>{appointment.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            {appointment.appointmentType === "video" ? (
                                                <Video className="w-4 h-4" />
                                            ) : (
                                                <MapPin className="w-4 h-4" />
                                            )}
                                            <span>
                                                {appointment.appointmentType === "video" ? "Video Consultation" : appointment.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <DollarSign className="w-4 h-4" />
                                            <span>₹{appointment.consultationFee}</span>
                                        </div>
                                    </div>

                                    {/* Symptoms (if any) */}
                                    {appointment.symptoms && (
                                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {appointment.status === "upcoming" && (
                                            <>
                                                {appointment.appointmentType === "video" && isTodayOrFuture(appointment.date) && (
                                                    <button
                                                        onClick={() => handleJoinCall(appointment)}
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

                                        {appointment.status === "completed" && (
                                            <>
                                                <button
                                                    onClick={() => handleViewSummary(appointment)}
                                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    View Summary
                                                </button>
                                                <button
                                                    onClick={() => handleBookAgain(appointment.doctorId)}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                    Book Again
                                                </button>
                                            </>
                                        )}

                                        {appointment.status === "cancelled" && (
                                            <button
                                                onClick={() => handleBookAgain(appointment.doctorId)}
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
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cancel Appointment</h3>
                            <button
                                onClick={() => setShowCancelModal(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Are you sure you want to cancel your appointment with <strong>{showCancelModal.doctorName}</strong>?
                        </p>
                        {showCancelModal.patientName && showCancelModal.patientName !== `${loginPatient?.firstName} ${loginPatient?.lastName}` && (
                            <p className="text-sm text-orange-600 dark:text-orange-400 mb-2">
                                Note: This appointment was booked for {showCancelModal.patientName}.
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