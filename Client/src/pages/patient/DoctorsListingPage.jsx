import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Star,
    MapPin,
    DollarSign,
    Briefcase,
    CheckCircle,
    ChevronRight,
    X,
    User,
    Stethoscope,
    Calendar,
    GraduationCap,
    Languages,
    Heart,
    Sparkles,
    Shield,
    TrendingUp,
    Users,
    MessageCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { getAllDoctorsService } from "../../services/doctor.service";
import Loader from "../../components/common/Loader";
import MedicalBackground from "../../components/common/MedicalBackground";

export default function DoctorsListingPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
    const [sortBy, setSortBy] = useState("rating");
    const [specialties, setSpecialties] = useState(["All Specialties"]);
    const [viewMode, setViewMode] = useState("grid");

    // Fetch doctors from API
    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                sortBy: sortBy,
                ...(selectedSpecialty !== "All Specialties" && { specialty: selectedSpecialty })
            };

            const response = await getAllDoctorsService(params);

            if (response?.data?.success) {
                setDoctors(response?.data?.data);
                const uniqueSpecialties = ["All Specialties", ...new Set(
                    response.data.data.map(doc => doc.specialty).filter(Boolean)
                )];
                setSpecialties(uniqueSpecialties);
            } else {
                toast.error("Failed to load doctors");
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || "Failed to load doctors");
        } finally {
            setLoading(false);
        }
    }, [sortBy, selectedSpecialty]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const filteredDoctors = useMemo(() => {
        let filtered = doctors;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(doctor =>
                `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(query) ||
                doctor.specialty?.toLowerCase().includes(query) ||
                doctor.clinicCity?.toLowerCase().includes(query) ||
                doctor.medicalDegree?.toLowerCase().includes(query)
            );
        }
        return filtered;
    }, [doctors, searchQuery]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedSpecialty("All Specialties");
        setSortBy("rating");
    };

    // Helper function to get rating color
    const getRatingColor = (rating) => {
        if (rating >= 4.5) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400";
        if (rating >= 4) return "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400";
        if (rating >= 3.5) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400";
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400";
    };

    // Grid View Card Component
    const DoctorGridCard = ({ doctor }) => (
        <div className="group relative bg-white dark:bg-neutral-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 border border-neutral-200 dark:border-neutral-800">
            {/* Top Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

            {/* Profile Image Section */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20">
                <img
                    src={doctor.profilePhoto || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=10b981&color=fff&size=150&bold=true&length=2`}
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=10b981&color=fff&size=150&bold=true&length=2`;
                    }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {doctor.isVerified && (
                        <div className="bg-emerald-500 text-white rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                        </div>
                    )}
                    {doctor.successRate >= 95 && (
                        <div className="bg-amber-500 text-white rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <Sparkles className="w-3 h-3" />
                            Top Rated
                        </div>
                    )}
                </div>

                {/* Rating Badge */}
                {doctor.rating > 0 && (
                    <div className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-lg ${getRatingColor(doctor.rating)}`}>
                        <Star className="w-3 h-3 fill-current" />
                        <span>{doctor.rating.toFixed(1)}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">({doctor.totalReviews || 0})</span>
                    </div>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className="bg-white dark:bg-neutral-800 rounded-full p-2 shadow-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
                        <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="bg-white dark:bg-neutral-800 rounded-full p-2 shadow-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
                        <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Doctor Info */}
            <div className="p-5">
                <div className="mb-3">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 line-clamp-1">
                        Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5" />
                            {doctor.specialty || "General Physician"}
                        </p>
                        {doctor.subSpecialty && (
                            <>
                                <span className="text-gray-300 dark:text-neutral-700">•</span>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">{doctor.subSpecialty}</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {doctor.yearsOfExperience > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 rounded-lg px-2 py-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-xs">{doctor.yearsOfExperience}+ yrs</span>
                        </div>
                    )}
                    {doctor.totalPatients > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 rounded-lg px-2 py-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-xs">{doctor.totalPatients}+ patients</span>
                        </div>
                    )}
                    {doctor.totalAppointments > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 rounded-lg px-2 py-1.5">
                            <Calendar className="w-3.5 h-3.5 text-purple-500" />
                            <span className="text-xs">{doctor.totalAppointments}+ apps</span>
                        </div>
                    )}
                    {doctor.consultationFee > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 rounded-lg px-2 py-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-xs">₹{doctor.consultationFee}</span>
                        </div>
                    )}
                </div>

                {/* Location & Education */}
                <div className="space-y-2 mb-4">
                    {doctor.clinicCity && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3.5 h-3.5 text-red-400" />
                            <span className="line-clamp-1">{doctor.clinicCity}{doctor.clinicState ? `, ${doctor.clinicState}` : ''}</span>
                        </div>
                    )}
                    {doctor.medicalDegree && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                            <span className="line-clamp-1">{doctor.medicalDegree}{doctor.university ? `, ${doctor.university}` : ''}</span>
                        </div>
                    )}
                    {doctor.languages?.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Languages className="w-3.5 h-3.5 text-purple-400" />
                            <span>{doctor.languages.slice(0, 2).join(", ")}{doctor.languages.length > 2 && ` +${doctor.languages.length - 2}`}</span>
                        </div>
                    )}
                </div>

                {/* Available Days Badges */}
                {doctor.availableDays?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {doctor.availableDays.slice(0, 3).map((day, idx) => (
                            <span key={idx} className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">
                                {day.slice(0, 3)}
                            </span>
                        ))}
                        {doctor.availableDays.length > 3 && (
                            <span className="text-xs bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded">
                                +{doctor.availableDays.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Link
                        to={`/doctor/${doctor._id}`}
                        className="flex-1 text-center bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-medium transition-all text-sm group-hover:shadow-md"
                    >
                        View Profile
                    </Link>
                    <Link
                        to={`/p/book-appointment/${doctor._id}`}
                        className="flex-1 text-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                    >
                        Book <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );

    // List View Card Component
    const DoctorListCard = ({ doctor }) => (
        <div className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative md:w-48 h-48 md:h-auto overflow-hidden bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20">
                    <img
                        src={doctor.profilePhoto || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=10b981&color=fff&size=150&bold=true&length=2`}
                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=10b981&color=fff&size=150&bold=true&length=2`;
                        }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {doctor.isVerified && (
                            <div className="bg-emerald-500 text-white rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </h3>
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getRatingColor(doctor.rating)}`}>
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{doctor.rating?.toFixed(1) || "New"}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-3">
                                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1">
                                    <Stethoscope className="w-4 h-4" />
                                    {doctor.specialty || "General Physician"}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" />
                                    {doctor.yearsOfExperience || 0}+ Years Experience
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {doctor.totalPatients || 0}+ Patients
                                </span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                {doctor.bio || `${doctor.firstName} ${doctor.lastName} is a renowned ${doctor.specialty || "medical professional"} with extensive experience in patient care.`}
                            </p>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                {doctor.medicalDegree && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <GraduationCap className="w-4 h-4" />
                                        <span>{doctor.medicalDegree}</span>
                                    </div>
                                )}
                                {doctor.clinicCity && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <MapPin className="w-4 h-4" />
                                        <span>{doctor.clinicCity}</span>
                                    </div>
                                )}
                                {doctor.consultationFee > 0 && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <DollarSign className="w-4 h-4" />
                                        <span>₹{doctor.consultationFee} consultation</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row md:flex-col gap-3">
                            <Link
                                to={`/doctor/${doctor._id}`}
                                className="px-6 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 font-medium transition-all text-center"
                            >
                                View Profile
                            </Link>
                            <Link
                                to={`/p/book-appointment/${doctor._id}`}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium transition-all text-center shadow-md"
                            >
                                Book Appointment
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <Loader size="lg" color="green" fullScreen text="Loading doctors..." />;
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900">

            <MedicalBackground />
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 dark:from-[#0a2a2a] dark:via-[#0a3535] dark:to-[#063333] overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm mb-4">
                        <Shield className="w-4 h-4" />
                        <span>Trusted by 50,000+ Patients</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Find Your Perfect Doctor</h1>
                    <p className="text-green-100 text-lg max-w-2xl mx-auto">
                        Browse through our list of certified and experienced medical professionals
                    </p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md py-4 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by doctor name, specialty, city, or qualification..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Filter Controls */}
                        <div className="flex gap-3">
                            {/* Specialty Filter */}
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="px-5 py-3.5 pr-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
                            >
                                {specialties.map((specialty, idx) => (
                                    <option key={idx} value={specialty}>{specialty}</option>
                                ))}
                            </select>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-5 py-3.5 pr-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
                            >
                                <option value="rating">Sort by Rating</option>
                                <option value="experience">Sort by Experience</option>
                                <option value="fees">Sort by Fees (Low to High)</option>
                            </select>

                            {/* View Toggle */}
                            <div className="flex rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`px-4 py-3.5 transition-colors ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800"}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`px-4 py-3.5 transition-colors ${viewMode === "list" ? "bg-green-600 text-white" : "bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800"}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Clear Filters */}
                            {(searchQuery || selectedSpecialty !== "All Specialties" || sortBy !== "rating") && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-500 dark:text-gray-400">
                        Found <span className="font-semibold text-gray-900 dark:text-white">{filteredDoctors.length}</span> doctors
                        {selectedSpecialty !== "All Specialties" && ` in ${selectedSpecialty}`}
                    </p>
                    <div className="hidden md:flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Showing top {filteredDoctors.length} results
                        </span>
                    </div>
                </div>

                {/* Doctors Grid/List */}
                {filteredDoctors.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                            <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No doctors found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            We couldn't find any doctors matching your criteria. Try adjusting your filters or search term.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors shadow-md"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <DoctorGridCard key={doctor._id} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredDoctors.map((doctor) => (
                            <DoctorListCard key={doctor._id} doctor={doctor} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}