import React, { useState, useEffect, useContext } from "react";
import {
    FileText,
    Download,
    Printer,
    Eye,
    Calendar,
    Clock,
    Video,
    Stethoscope,
    Pill,
    AlertCircle,
    User,
    ChevronRight,
    Search,
    XCircle,
    CheckCircle,
    FileSignature,
    MapPin,
    Filter,
    SlidersHorizontal,
    TrendingUp,
    Activity,
    Heart,
    Shield,
    Award,
    ChevronDown,
    X
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { getMyPrescriptions } from "../../services/prescription.service";

export default function PrescriptionsPage() {
    const { loginUser } = useContext(AuthContext);

    const [prescriptions, setPrescriptions] = useState([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRelation, setFilterRelation] = useState("all");
    const [expandedPrescription, setExpandedPrescription] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    const userId = loginUser?._id;

    useEffect(() => {
        const fetchPrescriptions = async () => {
            setLoading(true);
            try {
                const response = await getMyPrescriptions();
                setPrescriptions(response?.data?.prescriptions || []);
            } catch (error) {
                console.error("Failed to fetch prescriptions:", error);
                setPrescriptions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, [userId]);

    useEffect(() => {
        let filtered = [...prescriptions];

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (pres) =>
                    pres?.doctorSnapshot?.name?.toLowerCase().includes(search) ||
                    pres?.doctorSnapshot?.specialty?.toLowerCase().includes(search) ||
                    pres?.medicines?.some((med) =>
                        med?.name?.toLowerCase().includes(search)
                    ) ||
                    pres?.notes?.toLowerCase().includes(search)
            );
        }

        if (filterRelation === "self") {
            filtered = filtered.filter(
                (pres) => pres?.patientSnapshot?.relation === "self"
            );
        } else if (filterRelation === "family") {
            filtered = filtered.filter(
                (pres) => pres?.patientSnapshot?.relation !== "self"
            );
        }

        if (filterStatus !== "all") {
            filtered = filtered.filter((pres) => {
                const status = getPrescriptionStatus(pres?.date);
                return status.label.toLowerCase() === filterStatus;
            });
        }

        setFilteredPrescriptions(filtered);
    }, [searchTerm, filterRelation, filterStatus, prescriptions]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatDateShort = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getDoctorName = (prescription) => {
        return prescription?.doctorSnapshot?.name || "Dr. Unknown";
    };

    const getDoctorSpecialty = (prescription) => {
        return prescription?.doctorSnapshot?.specialty || "Specialist";
    };

    const getPatientName = (prescription) => {
        return prescription?.patientSnapshot?.name || "Patient";
    };

    const getPatientRelation = (prescription) => {
        return prescription?.patientSnapshot?.relation || "self";
    };

    const getPrescriptionStatus = (date) => {
        if (!date) return { label: "Unknown", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: FileText, gradient: "from-gray-400 to-gray-500" };
        const daysOld = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (daysOld <= 7) return { label: "Active", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400", icon: CheckCircle, gradient: "from-emerald-500 to-teal-500" };
        if (daysOld <= 30) return { label: "Current", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400", icon: Clock, gradient: "from-blue-500 to-cyan-500" };
        return { label: "Archived", color: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400", icon: FileText, gradient: "from-neutral-500 to-neutral-600" };
    };

    const getAppointmentTypeIcon = (type) => {
        switch (type) {
            case "video":
                return Video;
            case "clinic":
                return MapPin;
            default:
                return Stethoscope;
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

    const handleViewDetails = (prescription) => {
        setSelectedPrescription(prescription);
        setShowDetailsModal(true);
    };

    const handleDownload = (prescription) => {
        // Implement PDF download logic here
        alert(`Downloading prescription as PDF...`);
    };

    const handlePrint = () => {
        window.print();
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
        <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white transform hover:scale-105 transition-transform duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold">{count}</p>
                    <p className="text-sm opacity-90 mt-1">{label}</p>
                </div>
                <Icon className="w-10 h-10 opacity-80" />
            </div>
        </div>
    );

    const stats = {
        total: prescriptions.length,
        active: prescriptions.filter(p => getPrescriptionStatus(p?.date).label === "Active").length,
        family: prescriptions.filter(p => p?.patientSnapshot?.relation !== "self").length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-emerald-200 dark:border-emerald-800 rounded-full animate-pulse"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-neutral-600 dark:text-neutral-400 font-medium">
                        Loading your prescriptions...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen mb-8">

            {/* Animated Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm mb-4">
                            <FileText className="w-4 h-4" />
                            <span>Your Medical Records</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Prescriptions
                        </h1>
                        <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                            Access all your prescribed medications and doctor's instructions in one place
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">

                {/* Enhanced Search and Filter Bar */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by doctor name, specialty, or medicine..."
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
                                {(filterRelation !== "all" || filterStatus !== "all") && (
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                )}
                            </button>

                            {(searchTerm || filterRelation !== "all" || filterStatus !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterRelation("all");
                                        setFilterStatus("all");
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Prescription Type
                                    </label>
                                    <select
                                        value={filterRelation}
                                        onChange={(e) => setFilterRelation(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="all">All Prescriptions</option>
                                        <option value="self">My Prescriptions</option>
                                        <option value="family">Family Prescriptions</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="current">Current</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {filteredPrescriptions.length === 0 ? (
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-16 text-center">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center">
                            <FileText className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                            No Prescriptions Found
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                            {searchTerm || filterRelation !== "all" || filterStatus !== "all"
                                ? "Try adjusting your search or filters to find what you're looking for"
                                : "You don't have any prescriptions yet. Prescriptions will appear here after your doctor's appointments."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredPrescriptions.map((prescription) => {
                            const status = getPrescriptionStatus(prescription?.date);
                            const StatusIcon = status.icon;
                            const isExpanded = expandedPrescription === prescription?._id;
                            const TypeIcon = getAppointmentTypeIcon(prescription?.appointmentType);
                            const isFamily = getPatientRelation(prescription) !== "self";

                            return (
                                <div
                                    key={prescription?._id}
                                    className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:-translate-y-1"
                                >
                                    {/* Gradient Top Bar */}
                                    <div className={`h-1 bg-gradient-to-r ${status.gradient}`}></div>

                                    {/* Card Header */}
                                    <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-3">
                                                    {/* Doctor Avatar with Ring */}
                                                    <div className="relative">
                                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${status.gradient} opacity-75 blur-md group-hover:opacity-100 transition-opacity`}></div>
                                                        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                                            <span className="text-lg font-bold text-white">
                                                                {getInitials(getDoctorName(prescription))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                            {getDoctorName(prescription)}
                                                        </h3>
                                                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                            {getDoctorSpecialty(prescription)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDateShort(prescription?.date)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <TypeIcon className="w-4 h-4" />
                                                        {getAppointmentTypeLabel(prescription?.appointmentType)}
                                                    </div>
                                                    {isFamily && (
                                                        <div className="flex items-center gap-1">
                                                            <User className="w-4 h-4" />
                                                            For: {getPatientName(prescription)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {status.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Pill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                <span className="font-semibold text-neutral-900 dark:text-white">
                                                    Medicines Prescribed
                                                </span>
                                            </div>
                                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                                {prescription?.medicines?.length || 0} medicine(s)
                                            </span>
                                        </div>

                                        {/* Medicine Preview */}
                                        <div className="space-y-3">
                                            {(prescription?.medicines || [])
                                                .slice(0, isExpanded ? undefined : 2)
                                                .map((medicine, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-start justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-medium text-neutral-900 dark:text-white">
                                                                {medicine?.name}
                                                            </p>
                                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                                {medicine?.dosage}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                                {medicine?.frequency}
                                                            </p>
                                                            {!isExpanded && idx === 1 && (prescription?.medicines?.length || 0) > 2 && (
                                                                <p className="text-xs text-neutral-400 mt-1">
                                                                    +{(prescription?.medicines?.length || 0) - 2} more
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                        {/* Notes Preview */}
                                        {prescription?.notes && (
                                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-1">
                                                    Doctor's Notes
                                                </p>
                                                <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
                                                    {prescription.notes}
                                                </p>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                            <button
                                                onClick={() => setExpandedPrescription(isExpanded ? null : prescription?._id)}
                                                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium flex items-center gap-1 transition-all"
                                            >
                                                {isExpanded ? "Show Less" : "View All Medicines"}
                                                <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                                            </button>

                                            <button
                                                onClick={() => handleViewDetails(prescription)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium text-sm transition-all transform hover:scale-105"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </button>
                                        </div>

                                        {/* Expanded Medicine List */}
                                        {isExpanded && (
                                            <div className="mt-5 space-y-3">
                                                {(prescription?.medicines || []).map((medicine, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700"
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                                            <div>
                                                                <h4 className="font-semibold text-neutral-900 dark:text-white">
                                                                    {medicine?.name}
                                                                </h4>
                                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                                    {medicine?.dosage}
                                                                </p>
                                                            </div>
                                                            <div className="text-left sm:text-right">
                                                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                                    {medicine?.frequency}
                                                                </p>
                                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                                    Duration: {medicine?.duration}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {medicine?.instructions && (
                                                            <div className="mt-3 p-3 bg-white dark:bg-neutral-800 rounded-lg">
                                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Instructions</p>
                                                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                                                    {medicine.instructions}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="flex gap-4 mt-3 text-sm">
                                                            <div>
                                                                <span className="text-xs text-neutral-500 dark:text-neutral-400">Quantity</span>
                                                                <p className="font-medium text-neutral-900 dark:text-white">{medicine?.quantity}</p>
                                                            </div>
                                                            {medicine?.refills > 0 && (
                                                                <div>
                                                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">Refills Left</span>
                                                                    <p className="font-medium text-neutral-900 dark:text-white">{medicine.refills}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Enhanced Prescription Details Modal */}
            {showDetailsModal && selectedPrescription && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform animate-in slide-in-from-bottom-4 duration-300">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-neutral-900 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                                    <FileSignature className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                    Prescription Details
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <XCircle className="w-6 h-6 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Doctor & Appointment Info */}
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                            <span className="text-xl font-bold text-white">
                                                {getInitials(getDoctorName(selectedPrescription))}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                                                {getDoctorName(selectedPrescription)}
                                            </h3>
                                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                {getDoctorSpecialty(selectedPrescription)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-neutral-500" />
                                            <span className="text-neutral-700 dark:text-neutral-300">
                                                {formatDate(selectedPrescription?.date)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            {(() => {
                                                const TypeIcon = getAppointmentTypeIcon(selectedPrescription?.appointmentType);
                                                return <TypeIcon className="w-4 h-4 text-neutral-500" />;
                                            })()}
                                            <span className="text-neutral-700 dark:text-neutral-300">
                                                {getAppointmentTypeLabel(selectedPrescription?.appointmentType)}
                                            </span>
                                        </div>
                                        {getPatientRelation(selectedPrescription) !== "self" && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="w-4 h-4 text-neutral-500" />
                                                <span className="text-neutral-700 dark:text-neutral-300">
                                                    Patient: {getPatientName(selectedPrescription)} ({getPatientRelation(selectedPrescription)})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Medicines List */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                        <Pill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                        Prescribed Medicines
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {(selectedPrescription?.medicines || []).map((medicine, idx) => (
                                        <div
                                            key={idx}
                                            className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-md transition-all"
                                        >
                                            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-800 px-5 py-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <div>
                                                        <h4 className="font-bold text-neutral-900 dark:text-white">
                                                            {medicine?.name}
                                                        </h4>
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                            {medicine?.dosage}
                                                        </p>
                                                    </div>
                                                    <div className="text-left sm:text-right">
                                                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                            {medicine?.frequency}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                            Duration: {medicine?.duration}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-5 py-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-neutral-500 dark:text-neutral-400">Quantity:</span>
                                                        <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                                                            {medicine?.quantity}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-neutral-500 dark:text-neutral-400">Refills:</span>
                                                        <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                                                            {medicine?.refills || 0} remaining
                                                        </span>
                                                    </div>
                                                </div>
                                                {medicine?.instructions && (
                                                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                                        <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-1">
                                                            Instructions
                                                        </p>
                                                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                                            {medicine.instructions}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Doctor Notes */}
                            {selectedPrescription?.notes && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                            Doctor's Notes
                                        </h3>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                                        <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                                            {selectedPrescription.notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                <button
                                    onClick={() => handleDownload(selectedPrescription)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all transform hover:scale-105"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                                >
                                    <Printer className="w-4 h-4" />
                                    Print Prescription
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}