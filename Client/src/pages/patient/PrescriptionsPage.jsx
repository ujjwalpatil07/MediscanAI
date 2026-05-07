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

        setFilteredPrescriptions(filtered);
    }, [searchTerm, filterRelation, prescriptions]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Get doctor name
    const getDoctorName = (prescription) => {
        return prescription?.doctorSnapshot?.name || "Dr. Unknown";
    };

    // Get doctor specialty
    const getDoctorSpecialty = (prescription) => {
        return prescription?.doctorSnapshot?.specialty || "Specialist";
    };

    // Get patient name
    const getPatientName = (prescription) => {
        return prescription?.patientSnapshot?.name || "Patient";
    };

    // Get patient relation
    const getPatientRelation = (prescription) => {
        return prescription?.patientSnapshot?.relation || "self";
    };

    // Get status based on date
    const getPrescriptionStatus = (date) => {
        if (!date) return { label: "Unknown", color: "text-gray-600 bg-gray-100 dark:bg-gray-700", icon: FileText };
        const daysOld = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (daysOld <= 7) return { label: "Active", color: "text-green-600 bg-green-100 dark:bg-green-900/30", icon: CheckCircle };
        if (daysOld <= 30) return { label: "Current", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", icon: Clock };
        return { label: "Archived", color: "text-gray-600 bg-gray-100 dark:bg-gray-700", icon: FileText };
    };

    // Get appointment type icon
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

    // Get appointment type label
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

    // Handle view details
    const handleViewDetails = (prescription) => {
        setSelectedPrescription(prescription);
        setShowDetailsModal(true);
    };

    // Handle download
    const handleDownload = (prescription) => {
        alert(`Downloading prescription as PDF...`);
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n?.[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Loading prescriptions...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center">
                                <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Prescriptions
                                </h1>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                View all your prescribed medications and doctor's instructions
                            </p>
                        </div>

                        {/* Search and Filter */}
                        <div className="mt-4 sm:mt-0 flex space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search prescriptions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                />
                            </div>

                            <select
                                value={filterRelation}
                                onChange={(e) => setFilterRelation(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-sm"
                            >
                                <option value="all">All Prescriptions</option>
                                <option value="self">My Prescriptions</option>
                                <option value="family">Family Prescriptions</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredPrescriptions.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                        <FileText className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No Prescriptions Found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            {searchTerm || filterRelation !== "all"
                                ? "Try adjusting your search or filters"
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
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    {/* Doctor Avatar */}
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                            {getInitials(getDoctorName(prescription))}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            {getDoctorName(prescription)}
                                                        </h3>
                                                        <p className="text-sm text-green-600 dark:text-green-400">
                                                            {getDoctorSpecialty(prescription)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mt-3">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {formatDate(prescription?.date)}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <TypeIcon className="w-4 h-4 mr-1" />
                                                        {getAppointmentTypeLabel(prescription?.appointmentType)}
                                                    </div>
                                                    {isFamily && (
                                                        <div className="flex items-center">
                                                            <User className="w-4 h-4 mr-1" />
                                                            For: {getPatientName(prescription)} ({getPatientRelation(prescription)})
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                                            >
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {status.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <Pill className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Medicines Prescribed
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {prescription?.medicines?.length || 0} medicine(s)
                                            </span>
                                        </div>

                                        {/* Medicine Preview */}
                                        <div className="space-y-2">
                                            {(prescription?.medicines || [])
                                                .slice(0, isExpanded ? undefined : 2)
                                                .map((medicine, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-start justify-between text-sm"
                                                    >
                                                        <div className="flex-1">
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {medicine?.name}
                                                            </span>
                                                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                                                {medicine?.dosage}
                                                            </span>
                                                            {!isExpanded &&
                                                                idx === 1 &&
                                                                (prescription?.medicines?.length || 0) > 2 && (
                                                                    <span className="text-xs text-gray-400 ml-2">
                                                                        +{(prescription?.medicines?.length || 0) - 2} more
                                                                    </span>
                                                                )}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {medicine?.frequency}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                        {/* Notes preview */}
                                        {prescription?.notes && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">
                                                {prescription.notes}
                                            </p>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                            <button
                                                onClick={() =>
                                                    setExpandedPrescription(
                                                        isExpanded ? null : prescription?._id
                                                    )
                                                }
                                                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 font-medium flex items-center"
                                            >
                                                {isExpanded ? "Show Less" : "Show All Medicines"}
                                                <ChevronRight
                                                    className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? "rotate-90" : ""
                                                        }`}
                                                />
                                            </button>

                                            <button
                                                onClick={() => handleViewDetails(prescription)}
                                                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View Details
                                            </button>
                                        </div>

                                        {/* Expanded Medicine List */}
                                        {isExpanded && (
                                            <div className="mt-4 space-y-3">
                                                {(prescription?.medicines || []).map((medicine, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                                    {medicine?.name}
                                                                </h4>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {medicine?.dosage}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                                                    {medicine?.frequency}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Duration: {medicine?.duration}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {medicine?.instructions && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                                                                {medicine.instructions}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                            <span>Qty: {medicine?.quantity}</span>
                                                            {medicine?.refills > 0 && (
                                                                <span>Refills: {medicine.refills}</span>
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

            {/* Prescription Details Modal */}
            {showDetailsModal && selectedPrescription && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
                            <div className="flex items-center">
                                <FileSignature className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Prescription Details
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Doctor & Appointment Info */}
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {getInitials(getDoctorName(selectedPrescription))}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {getDoctorName(selectedPrescription)}
                                                </h3>
                                                <p className="text-sm text-green-600 dark:text-green-400">
                                                    {getDoctorSpecialty(selectedPrescription)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm">
                                            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {formatDate(selectedPrescription?.date)}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            {(() => {
                                                const TypeIcon = getAppointmentTypeIcon(selectedPrescription?.appointmentType);
                                                return <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />;
                                            })()}
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {getAppointmentTypeLabel(selectedPrescription?.appointmentType)}
                                            </span>
                                        </div>
                                        {getPatientRelation(selectedPrescription) !== "self" && (
                                            <div className="flex items-center text-sm">
                                                <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    Patient: {getPatientName(selectedPrescription)} ({getPatientRelation(selectedPrescription)})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Medicines List */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <Pill className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Prescribed Medicines
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {(selectedPrescription?.medicines || []).map((medicine, idx) => (
                                        <div
                                            key={idx}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                        >
                                            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            {medicine?.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {medicine?.dosage}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-900 dark:text-white">
                                                            {medicine?.frequency}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Duration: {medicine?.duration}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-3">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                                                        <span className="ml-2 text-gray-900 dark:text-white">
                                                            {medicine?.quantity}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Refills:</span>
                                                        <span className="ml-2 text-gray-900 dark:text-white">
                                                            {medicine?.refills || 0} remaining
                                                        </span>
                                                    </div>
                                                </div>
                                                {medicine?.instructions && (
                                                    <div className="mt-3">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">Instructions:</span>
                                                        <p className="text-sm text-gray-900 dark:text-white mt-1">
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
                                    <div className="flex items-center mb-3">
                                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Doctor's Notes
                                        </h3>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                            {selectedPrescription.notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => handleDownload(selectedPrescription)}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Printer className="w-4 h-4 mr-2" />
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