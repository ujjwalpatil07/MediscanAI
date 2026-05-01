import React from "react";
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
    Video
} from "lucide-react";
import { doctorsData } from "../../utils/data";

// Helper function to mask license number
const maskLicenseNumber = (license) => {
    if (license.length <= 8) return license;
    return license.slice(0, 6) + "****" + license.slice(-4);
};

export default function DoctorProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find doctor by id
    const doctor = doctorsData.find(doc => doc.id === Number.parseInt(id));

    // Handle doctor not found
    if (!doctor) {
        return (
            <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] dark:text-gray-300 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Doctor Not Found</h1>
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
        navigate("/appointment", { state: { id } });
    };

    const handleChat = () => {
        alert(`Starting chat with Dr. ${doctor.firstName} ${doctor.lastName}\n\nThis feature will be available soon!`);
    };

    // Render stars for rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" className="w-4 h-4 text-yellow-500 fill-yellow-500 opacity-50" />);
        }
        return stars;
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] dark:text-gray-300">
            {/* Hero Section with Doctor Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-700 dark:from-[#0a2a2a] dark:to-[#063333] py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Doctor Image */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img
                                src={doctor.image}
                                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </h1>
                                {doctor.isVerified && (
                                    <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-green-100 text-lg mb-2 flex items-center justify-center md:justify-start gap-1">
                                <Stethoscope className="w-4 h-4" />
                                {doctor.specialty}
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-green-100">
                                <div className="flex items-center gap-1">
                                    {renderStars(doctor.rating)}
                                    <span className="ml-1">{doctor.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" />
                                    {doctor.yearsOfExperience} years exp.
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {doctor.clinicAddress.city}, {doctor.clinicAddress.state}
                                </div>
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
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                                About Doctor
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                {doctor.bio}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-start gap-3">
                                    <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Medical Degree</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{doctor.medicalDegree}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <IdCard className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">License Number</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{maskLicenseNumber(doctor.licenseNumber)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Consultations</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{doctor.totalConsultations.toLocaleString()}+ patients</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Hospital Affiliation</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{doctor.hospital}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Consultation Info */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Consultation Details
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Consultation Fee</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ₹{doctor.consultationFee}
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> per visit</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Languages Spoken</p>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.languages.map((lang, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Available Days */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Available Days & Time
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Days Available</p>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.availableDays.map((day, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                                                {day}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Time Slots</p>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {doctor.availableTimeSlots.start} - {doctor.availableTimeSlots.end}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monday - Saturday</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Clinic Address Card */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md sticky top-20">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Clinic Address
                            </h2>
                            <div className="space-y-2 text-gray-600 dark:text-gray-400">
                                <p>{doctor.clinicAddress.street}</p>
                                <p>{doctor.clinicAddress.city}, {doctor.clinicAddress.state}</p>
                                <p>PIN: {doctor.clinicAddress.pincode}</p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={handleBookAppointment}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Book Appointment Now
                                </button>
                                <button
                                    onClick={handleChat}
                                    className="w-full mt-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <Video className="w-5 h-5" />
                                    Start Video Consultation
                                </button>
                            </div>

                            {/* Quick Contact */}
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Need help? Call us at{" "}
                                    <a href="tel:0900-78601" className="text-green-600 dark:text-green-400">
                                        0900-78601
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="bg-white dark:bg-gray-800/30 py-4 text-center border-t border-gray-200 dark:border-gray-700 mt-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Consultation fees and availability are subject to change. Please confirm at the time of booking.
                </p>
            </div>
        </div>
    );
}