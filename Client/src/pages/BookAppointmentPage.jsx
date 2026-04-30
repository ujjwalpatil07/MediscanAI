import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    Video,
    Building,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    Star,
    Briefcase,
    DollarSign,
    X
} from "lucide-react";
import { generateTimeSlots, getAvailableDates, formatDate, formatDateAPI } from "../utils/dateFormat";
import { doctorsData } from "../utils/data";
import { usePatientContext } from "../context/PatientContext";


export default function BookAppointmentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get doctor from location state or use default
    const doctorId = location.state?.id

    const { loginPatient } = usePatientContext();

    // State declarations
    const [appointmentType, setAppointmentType] = useState("clinic");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        gender: "",
        phoneNumber: "",
        symptoms: ""
    });

    const [formErrors, setFormErrors] = useState({});

    const doctor = useMemo(() => {
        if (!doctorId) return null;

        return doctorsData.find(
            (doc) => String(doc.id) === String(doctorId)
        );
    }, [doctorId]);

    // Get available dates based on doctor's available days
    const availableDates = useMemo(() => {
        if (doctor?.availableDays) {
            return getAvailableDates(doctor.availableDays);
        }
        return [];
    }, [doctor]);

    // Generate time slots when doctor is selected
    const timeSlots = useMemo(() => {
        if (doctor?.availableTimeSlots) {
            return generateTimeSlots(doctor.availableTimeSlots.start, doctor.availableTimeSlots.end);
        }
        return [];
    }, [doctor]);

    // Set default selected date to first available date
    useEffect(() => {
        if (availableDates.length > 0 && !selectedDate) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates, selectedDate]);

    useEffect(() => {
        if (loginPatient) {
            setFormData((prev) => ({
                ...prev,
                fullName: `${loginPatient.firstName} ${loginPatient.lastName}`,
                gender: loginPatient.gender?.toLowerCase() || ""
            }));
        }
    }, [loginPatient]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.fullName.trim()) {
            errors.fullName = "Full name is required";
        }

        if (!formData.age) {
            errors.age = "Age is required";
        } else if (Number.parseInt(formData.age, 10) < 0 || Number.parseInt(formData.age, 10) > 150) {
            errors.age = "Please enter a valid age";
        }

        if (!formData.gender) {
            errors.gender = "Gender is required";
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = "Please enter a valid 10-digit phone number";
        }

        if (!selectedDate) {
            errors.date = "Please select a date";
        }

        if (!selectedTimeSlot) {
            errors.timeSlot = "Please select a time slot";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setShowConfirmModal(true);
        }
    };

    // Confirm booking
    const confirmBooking = () => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const bookingData = {
                doctorId: doctor.id,
                doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                appointmentType: appointmentType === "clinic" ? "Clinic Visit" : "Video Consultation",
                date: formatDateAPI(selectedDate),
                timeSlot: selectedTimeSlot.display,
                patientDetails: formData,
                consultationFee: doctor.consultationFee,
                bookingId: `APT${Math.floor(Math.random() * 1000000)}`
            };

            console.log("Appointment Booked:", bookingData);
            alert(`✅ Appointment booked successfully!\n\nBooking ID: ${bookingData.bookingId}\nDoctor: ${bookingData.doctorName}\nDate: ${bookingData.date}\nTime: ${bookingData.timeSlot}\n\nWe'll send you a confirmation message shortly.`);

            setIsLoading(false);
            setShowConfirmModal(false);

            // Reset form
            setFormData({
                fullName: "",
                age: "",
                gender: "",
                phoneNumber: "",
                symptoms: ""
            });
            setSelectedTimeSlot(null);

            // Navigate back to doctor profile after short delay
            setTimeout(() => {
                navigate(`/doctor/${doctor.id}`);
            }, 2000);
        }, 1500);
    };

    // Doctor not found
    if (!doctor) {
        return (
            <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] dark:text-gray-300 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Doctor Not Found</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Unable to load doctor information. Please try again.
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

    // Calculate summary fee
    const totalFee = doctor.consultationFee;

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] dark:text-gray-300 mb-5">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-700 dark:from-[#0a2a2a] dark:to-[#063333] py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        to={`/doctor/${doctor.id}`}
                        className="inline-flex items-center gap-2 text-white hover:text-green-100 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Doctor Profile
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 text-center">Book Appointment</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Doctor Summary Card */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                                <img
                                    src={doctor.image}
                                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-green-100 dark:border-green-900/30"
                                />
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Dr. {doctor.firstName} {doctor.lastName}
                                        </h2>
                                        {doctor.isVerified && (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                    <p className="text-green-600 dark:text-green-400 text-sm mb-2">{doctor.specialty}</p>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            {doctor.rating}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="w-4 h-4" />
                                            {doctor.yearsOfExperience} years
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            ₹{doctor.consultationFee}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Type Selection */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appointment Type</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setAppointmentType("clinic")}
                                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${appointmentType === "clinic"
                                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                        : "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                                        }`}
                                >
                                    <Building className="w-5 h-5" />
                                    <span className="font-semibold">Clinic Visit</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAppointmentType("video")}
                                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${appointmentType === "video"
                                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                        : "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                                        }`}
                                >
                                    <Video className="w-5 h-5" />
                                    <span className="font-semibold">Video Consultation</span>
                                </button>
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-green-600" />
                                Select Date
                            </h3>
                            {formErrors.date && (
                                <p className="text-red-500 text-sm mb-3">{formErrors.date}</p>
                            )}
                            <div className="flex flex-wrap gap-3">
                                {availableDates.map((date, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedDate(date)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedDate && selectedDate.getTime() === date.getTime()
                                            ? "bg-green-600 text-white shadow-md"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                    >
                                        {formatDate(date)}
                                    </button>
                                ))}
                            </div>
                            {availableDates.length === 0 && (
                                <p className="text-gray-500 text-sm">No available dates found for this doctor.</p>
                            )}
                        </div>

                        {/* Time Slot Selection */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-600" />
                                Select Time Slot
                            </h3>
                            {formErrors.timeSlot && (
                                <p className="text-red-500 text-sm mb-3">{formErrors.timeSlot}</p>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {timeSlots.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedTimeSlot(slot)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedTimeSlot && selectedTimeSlot.value === slot.value
                                            ? "bg-green-600 text-white shadow-md"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                    >
                                        {slot.display}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Patient Details Form */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-green-600" />
                                Patient Details
                            </h3>

                            <form id="appointment-form" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border ${formErrors.fullName ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                                            } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                        placeholder="Enter full name"
                                    />
                                    {formErrors.fullName && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Age <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.age ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                                                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                            placeholder="Enter age"
                                        />
                                        {formErrors.age && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.gender ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                                                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {formErrors.gender && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border ${formErrors.phoneNumber ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                                            } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                        placeholder="10-digit mobile number"
                                    />
                                    {formErrors.phoneNumber && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Problem / Symptoms
                                    </label>
                                    <textarea
                                        name="symptoms"
                                        value={formData.symptoms}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Briefly describe your problem or symptoms..."
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20">
                            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appointment Summary</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400">Doctor</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Dr. {doctor.firstName} {doctor.lastName}
                                        </span>
                                    </div>

                                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400">Appointment Type</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {appointmentType === "clinic" ? "🏥 Clinic Visit" : "🎥 Video Consultation"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400">Date</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {selectedDate ? formatDate(selectedDate) : "Not selected"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400">Time Slot</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {selectedTimeSlot ? selectedTimeSlot.display : "Not selected"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400">Patient Name</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formData.fullName || "Not entered"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between pt-2">
                                        <span className="font-semibold text-gray-900 dark:text-white">Total Fee</span>
                                        <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                                            ₹{totalFee}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    form="appointment-form"
                                    disabled={isLoading}
                                    className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Book Appointment
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                                    By proceeding, you agree to our terms and conditions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Appointment</h3>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            <p className="text-gray-600 dark:text-gray-400">
                                Please confirm your appointment details:
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm">
                                <p><strong>Doctor:</strong> Dr. {doctor.firstName} {doctor.lastName}</p>
                                <p><strong>Date:</strong> {selectedDate && formatDate(selectedDate)}</p>
                                <p><strong>Time:</strong> {selectedTimeSlot?.display}</p>
                                <p><strong>Type:</strong> {appointmentType === "clinic" ? "Clinic Visit" : "Video Consultation"}</p>
                                <p><strong>Total Fee:</strong> ₹{totalFee}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBooking}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}