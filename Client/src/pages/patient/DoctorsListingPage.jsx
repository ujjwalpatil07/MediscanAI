import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Star,
    MapPin,
    DollarSign,
    Briefcase,
    CheckCircle,
    ChevronRight,
    Filter,
    X,
    User,
    Stethoscope
} from "lucide-react";
import { doctorsData } from "../../utils/data";

// Get unique specialties for filter dropdown
const specialties = ["All Specialties", ...new Set(doctorsData.map(doc => doc.specialty))];

export default function DoctorsListingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter doctors based on search query and specialty
    const filteredDoctors = useMemo(() => {
        let filtered = doctorsData;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(doctor =>
                `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(query) ||
                doctor.specialty.toLowerCase().includes(query)
            );
        }

        // Filter by specialty
        if (selectedSpecialty !== "All Specialties") {
            filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
        }

        return filtered;
    }, [searchQuery, selectedSpecialty]);

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery("");
        setSelectedSpecialty("All Specialties");
    };

    // Get unique specialties for filter (excluding "All Specialties")
    const filterSpecialties = specialties.slice(1);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] dark:text-gray-300">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-green-600 to-teal-700 dark:from-[#0a2a2a] dark:to-[#063333] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Find Your Perfect Doctor</h1>
                    <p className="text-green-100 text-center mt-2">Browse through our list of certified and experienced doctors</p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="sticky top-0 z-10 bg-gray-100 dark:bg-transparent py-4 border-b border-gray-200 dark:border-gray-700/50 backdrop-blur-sm bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by doctor name or specialty..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Dropdown - Desktop */}
                        <div className="hidden md:block relative">
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="px-5 py-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
                            >
                                {specialties.map((specialty, idx) => (
                                    <option key={idx} value={specialty}>{specialty}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Filter Button - Mobile */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="md:hidden flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                            <Filter className="w-5 h-5" />
                            Filter by Specialty
                            {selectedSpecialty !== "All Specialties" && (
                                <span className="ml-1 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                    {selectedSpecialty}
                                </span>
                            )}
                        </button>

                        {/* Clear Filters Button */}
                        {(searchQuery || selectedSpecialty !== "All Specialties") && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Mobile Filter Dropdown */}
                    {isFilterOpen && (
                        <div className="md:hidden mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setSelectedSpecialty("All Specialties");
                                        setIsFilterOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedSpecialty === "All Specialties"
                                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    All Specialties
                                </button>
                                {filterSpecialties.map((specialty, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedSpecialty(specialty);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedSpecialty === specialty
                                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {specialty}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                <p className="text-gray-500 dark:text-gray-400">
                    Found <span className="font-semibold text-gray-900 dark:text-white">{filteredDoctors.length}</span> doctors
                    {selectedSpecialty !== "All Specialties" && ` in ${selectedSpecialty}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                </p>
            </div>

            {/* Doctors Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
                {filteredDoctors.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No doctors found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            We couldn't find any doctors matching your criteria.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                            >
                                {/* Doctor Image */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20">
                                    <img
                                        src={doctor.image}
                                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {/* Verified Badge */}
                                    {doctor.isVerified && (
                                        <div className="absolute top-3 right-3 bg-green-600 text-white rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Verified
                                        </div>
                                    )}
                                    {/* Rating Badge */}
                                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-gray-900 dark:text-white">{doctor.rating}</span>
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                        Dr. {doctor.firstName} {doctor.lastName}
                                    </h3>
                                    <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-3 flex items-center gap-1">
                                        <Stethoscope className="w-3 h-3" />
                                        {doctor.specialty}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{doctor.yearsOfExperience} years experience</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <DollarSign className="w-4 h-4" />
                                            <span>₹{doctor.consultationFee} consultation fee</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                            <span>{doctor.clinicAddress.city}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/doctor/${doctor.id}`}
                                            className="flex-1 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium transition-colors text-sm"
                                        >
                                            View Profile
                                        </Link>
                                        <Link
                                            to={`/p/book-appointment/${doctor.id}`}
                                            className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-1"
                                        >
                                            Book <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Note */}
            <div className="bg-white dark:bg-gray-800/30 py-4 text-center border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredDoctors.length} of {doctorsData.length} doctors
                </p>
            </div>
        </div>
    );
}