import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Star,
    MapPin,
    Briefcase,
    CheckCircle,
    Calendar,
    Clock,
    Award,
    Shield,
    MessageCircle,
    ChevronRight,
    Stethoscope,
    GraduationCap,
    IdCard,
    Users,
    Video,
} from "lucide-react";
import { getDoctorById } from "../../services/doctor.service";

export default function DoctorProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDoctor() {
            try {
                const response = await getDoctorById(id);
                setDoctor(response?.data?.doctor || response?.data);
            } catch (error) {
                console.error("Failed to fetch doctor:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDoctor();
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Loading doctor profile...</p>
                </div>
            </div>
        );
    }

    // Not found state
    if (!doctor) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Doctor Not Found
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The doctor you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        to="/doctors"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                        Browse Doctors <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    const handleBookAppointment = () => {
        navigate(`/p/book-appointment/${id}`);
    };

    const handleChat = () => {
        navigate(`/p/messages?doctorId=${id}`);
    };

    // Get initials for avatar fallback
    const getInitials = () => {
        return `${doctor?.firstName?.[0] || ""}${doctor?.lastName?.[0] || ""}`;
    };

    // Get full name
    const getFullName = () => {
        return `Dr. ${doctor?.firstName || ""} ${doctor?.lastName || ""}`;
    };

    // Capitalize first letter
    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Render stars
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating || 0);
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < fullStars
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                />
            );
        }
        return stars;
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-neutral-900 dark:text-gray-300">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-teal-700 dark:from-green-900 dark:to-neutral-800 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Doctor Avatar */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-neutral-700 shadow-lg flex-shrink-0">
                            {doctor?.profilePhoto ? (
                                <img
                                    src={doctor.profilePhoto}
                                    alt={getFullName()}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                                        {getInitials()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {getFullName()}
                                </h1>
                                {doctor?.isVerified && (
                                    <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified
                                    </span>
                                )}
                            </div>

                            <p className="text-green-100 text-lg mb-2 flex items-center justify-center md:justify-start gap-1">
                                <Stethoscope className="w-4 h-4" />
                                {doctor?.specialty || "Specialty not specified"}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-green-100">
                                <div className="flex items-center gap-1">
                                    {renderStars(doctor?.rating)}
                                    <span className="ml-1">{doctor?.rating || 0}</span>
                                    {doctor?.totalReviews > 0 && (
                                        <span>({doctor.totalReviews} reviews)</span>
                                    )}
                                </div>
                                {doctor?.yearsOfExperience > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" />
                                        {doctor.yearsOfExperience} years exp.
                                    </div>
                                )}
                                {(doctor?.clinicCity || doctor?.clinicState) && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {[doctor?.clinicCity, doctor?.clinicState]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleBookAppointment}
                                className="inline-flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-gray-100 px-5 py-2 rounded-lg font-semibold transition-all"
                            >
                                <Calendar className="w-4 h-4" />
                                Book Appointment
                            </button>
                            <button
                                onClick={handleChat}
                                className="inline-flex items-center justify-center gap-2 bg-transparent border border-white text-white hover:bg-white/10 px-5 py-2 rounded-lg font-semibold transition-all"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-neutral-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                                About Doctor
                            </h2>
                            {doctor?.bio ? (
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                    {doctor.bio}
                                </p>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 italic mb-4">
                                    No bio available.
                                </p>
                            )}

                            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
                                {doctor?.medicalDegree && (
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Medical Degree</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {doctor.medicalDegree}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {doctor?.licenseNumber && (
                                    <div className="flex items-start gap-3">
                                        <IdCard className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">License Number</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {doctor.licenseNumber}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {doctor?.totalPatients > 0 && (
                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Patients</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {doctor.totalPatients.toLocaleString()}+ patients
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {doctor?.clinicName && (
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Clinic</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {doctor.clinicName}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* No info message if all fields are empty */}
                            {!doctor?.medicalDegree && !doctor?.licenseNumber &&
                                !doctor?.totalPatients && !doctor?.clinicName && (
                                    <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                                        Additional professional details coming soon.
                                    </p>
                                )}
                        </div>

                        {/* Consultation Info */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-neutral-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Consultation Details
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Consultation Fee</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ₹{doctor?.consultationFee || 0}
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> per visit</span>
                                    </p>
                                </div>
                                {doctor?.languages?.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Languages</p>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.languages.map((lang, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded-lg text-xs text-gray-600 dark:text-gray-300"
                                                >
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Days */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-neutral-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Available Days & Time
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Days Available</p>
                                    {doctor?.availableDays?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.availableDays.map((day, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium capitalize"
                                                >
                                                    {day}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                                            Availability not specified
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Time Slots</p>
                                    {doctor?.availableTimeSlots?.start && doctor?.availableTimeSlots?.end ? (
                                        <>
                                            <p className="text-gray-900 dark:text-white font-medium">
                                                {doctor.availableTimeSlots.start} - {doctor.availableTimeSlots.end}
                                            </p>
                                            {doctor?.availableDays?.length > 0 && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {doctor.availableDays.map((d) => capitalize(d)).join(", ")}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                                            Time slots not specified
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-neutral-700 sticky top-20">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Clinic Address
                            </h2>

                            {(doctor?.clinicAddress || doctor?.clinicCity || doctor?.clinicState) ? (
                                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                                    {doctor?.clinicAddress && <p>{doctor.clinicAddress}</p>}
                                    {doctor?.clinicAddress?.street && <p>{doctor.clinicAddress.street}</p>}
                                    <p>
                                        {[doctor?.clinicCity, doctor?.clinicState]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                    {doctor?.clinicPincode && <p>PIN: {doctor.clinicPincode}</p>}
                                    {doctor?.clinicAddress?.pincode && <p>PIN: {doctor.clinicAddress.pincode}</p>}
                                </div>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                                    Clinic address not specified
                                </p>
                            )}

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-700">
                                <button
                                    onClick={handleBookAppointment}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Book Appointment Now
                                </button>
                                <button
                                    onClick={handleChat}
                                    className="w-full mt-3 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <Video className="w-5 h-5" />
                                    Start Video Consultation
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Need help? Call us at{" "}
                                    <a
                                        href="tel:0900-78601"
                                        className="text-green-600 dark:text-green-400 hover:underline"
                                    >
                                        0900-78601
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-neutral-800 py-4 text-center border-t border-gray-200 dark:border-neutral-700 mt-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Consultation fees and availability are subject to change. Please confirm at the time of booking.
                </p>
            </div>
        </div>
    );
}