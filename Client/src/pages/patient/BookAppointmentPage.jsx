// BookAppointmentPage.jsx - Complete Fixed Version

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorsData, dummyAppointments } from '../../utils/data';
import { generateTimeSlots, getAvailableDates, formatDate } from "../../utils/dateUtils";
import ConfirmationModal from "../../components/patient/patientComponent/ConfirmationModal";
import Loader from "../../components/common/Loader";

export default function BookAppointmentPage() {

    const { doctor_id } = useParams();
    const navigate = useNavigate();

    // Local state for appointments (instead of context)
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // State management
    const [doctor, setDoctor] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [appointmentType, setAppointmentType] = useState('clinic');
    const [formData, setFormData] = useState({
        bookingFor: 'self',
        patientName: '',
        patientAge: '',
        patientPhone: '',
        symptoms: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Get logged-in user data (simulated)
    const currentUser = {
        id: 101,
        name: 'John Doe',
        phone: '9876543210'
    };

    // Load doctor data and appointments
    useEffect(() => {
        const foundDoctor = doctorsData.find(d => d.id === parseInt(doctor_id));
        if (!foundDoctor) {
            setError('Doctor not found');
            setIsLoading(false);
            setLoading(false);
            return;
        }
        setDoctor(foundDoctor);

        // Load appointments for this doctor only
        const doctorAppointments = dummyAppointments.filter(apt => apt.doctorId === parseInt(doctor_id));
        setAppointments(doctorAppointments);

        setIsLoading(false);
        setLoading(false);
    }, [doctor_id]);

    // Get booked time slots for current doctor and date (only upcoming)
    const getBookedTimeSlots = useCallback((doctorId, date) => {
        const today = new Date().toISOString().split('T')[0];
        return appointments
            .filter(apt =>
                apt.doctorId === doctorId &&
                apt.date === date &&
                apt.status === 'upcoming' &&
                apt.date >= today
            )
            .map(apt => apt.time);
    }, [appointments]);


    // Generate available dates when doctor loads
    useEffect(() => {
        if (doctor?.availableDays) {
            const dates = getAvailableDates(doctor.availableDays, 14);
            setAvailableDates(dates);
            if (dates.length > 0) {
                setSelectedDate(dates[0]);
            }
        }
    }, [doctor]);

    // Generate time slots and filter booked slots when date changes
    useEffect(() => {
        if (!doctor || !selectedDate) {
            setTimeSlots([]);
            setSelectedSlot('');
            return;
        }

        // Generate all possible slots
        const { start, end } = doctor.availableTimeSlots;
        const allSlots = generateTimeSlots(start, end);

        // Get booked slots for this doctor and date
        const bookedSlots = getBookedTimeSlots(doctor.id, selectedDate);

        // Filter out booked slots and create slot objects with status
        const availableSlotsWithStatus = allSlots.map(slot => ({
            time: slot,
            isBooked: bookedSlots.includes(slot)
        }));

        setTimeSlots(availableSlotsWithStatus);

        // Clear selected slot if it's no longer available
        if (selectedSlot && bookedSlots.includes(selectedSlot)) {
            setSelectedSlot('');
        }
    }, [doctor, selectedDate, getBookedTimeSlots, selectedSlot]);

    // Handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedSlot(''); // Clear selected slot when date changes
        setError('');
    };

    // Handle slot selection
    const handleSlotSelect = (slot) => {
        if (slot.isBooked) return;
        setSelectedSlot(slot.time);
        setError('');
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle booking for self/family toggle
    const handleBookingForChange = (value) => {
        setFormData(prev => ({
            ...prev,
            bookingFor: value,
            patientName: value === 'self' ? currentUser.name : '',
            patientAge: value === 'self' ? '' : '',
            patientPhone: value === 'self' ? currentUser.phone : ''
        }));
    };

    // Validation
    const validateForm = () => {
        if (!selectedDate) {
            setError('Please select a date');
            return false;
        }

        if (!selectedSlot) {
            setError('Please select a time slot');
            return false;
        }

        if (formData.bookingFor === 'family') {
            if (!formData.patientName.trim()) {
                setError('Please enter patient name');
                return false;
            }
            if (!formData.patientAge || formData.patientAge < 0 || formData.patientAge > 150) {
                setError('Please enter valid age (0-150)');
                return false;
            }
            if (!formData.patientPhone || !/^\d{10}$/.test(formData.patientPhone)) {
                setError('Please enter valid 10-digit phone number');
                return false;
            }
        }

        if (!formData.symptoms.trim()) {
            setError('Please describe your symptoms');
            return false;
        }

        return true;
    };

    // Handle booking submission
    const handleBooking = async () => {
        if (!validateForm()) return;
        setShowModal(true);
    };

    const confirmBooking = async () => {
        setBookingLoading(true);
        setError('');

        try {
            // Check for duplicate booking one more time before confirming
            const bookedSlots = getBookedTimeSlots(doctor.id, selectedDate);
            if (bookedSlots.includes(selectedSlot)) {
                throw new Error('This time slot has already been booked. Please select another slot.');
            }

            const appointmentData = {
                id: Date.now(), // Temporary ID
                userId: currentUser.id,
                doctorId: doctor.id,
                doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                specialty: doctor.specialty,
                rating: doctor.rating,
                doctorImage: doctor.image,
                appointmentType: appointmentType,
                date: selectedDate,
                time: selectedSlot,
                status: 'upcoming',
                consultationFee: doctor.consultationFee,
                symptoms: formData.symptoms,
                location: `${doctor.clinicAddress.city}, ${doctor.clinicAddress.state}`,
                ...(appointmentType === 'video' && {
                    meetingLink: `https://meet.example.com/${Math.random().toString(36).substr(2, 8)}`
                }),
                ...(formData.bookingFor === 'family' && {
                    patientName: formData.patientName,
                    patientAge: parseInt(formData.patientAge),
                    patientGender: 'not specified'
                })
            };

            // Add to local appointments state
            setAppointments(prev => [...prev, appointmentData]);

            // Reset form
            setSelectedSlot('');
            setFormData({
                bookingFor: 'self',
                patientName: '',
                patientAge: '',
                patientPhone: '',
                symptoms: ''
            });
            setShowModal(false);

            // Navigate to my appointments
            navigate('/p/my-appointments');
        } catch (err) {
            setError(err.message);
            setShowModal(false);
        } finally {
            setBookingLoading(false);
        }
    };

    // Calculate booked slots count for display
    const bookedSlotsCount = useMemo(() => {
        if (!doctor || !selectedDate) return 0;
        return getBookedTimeSlots(doctor.id, selectedDate).length;
    }, [doctor, selectedDate, getBookedTimeSlots]);

    const totalSlots = generateTimeSlots(
        doctor?.availableTimeSlots?.start || '09:00',
        doctor?.availableTimeSlots?.end || '17:00'
    ).length;

    const availableSlotsCount = timeSlots.filter(slot => !slot.isBooked).length;

    // Loading state
    if (isLoading || loading) {
        return <Loader size="lg" color="green" fullScreen text="Loading doctor details..." />;
    }

    // Doctor not found
    if (!doctor) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Not Found</h2>
                    <p className="text-gray-600 mb-4">The doctor you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/doctors')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                        Back to Doctors
                    </button>
                </div>
            </div>
        );
    }

    // No available dates
    if (availableDates.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Availability</h2>
                    <p className="text-gray-600 mb-4">This doctor has no available appointments in the next 14 days.</p>
                    <button
                        onClick={() => navigate('/doctors')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                        Back to Doctors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 pb-8">
                <div className="bg-gradient-to-r from-green-600 to-teal-700 dark:from-[#0a2a2a] dark:to-[#063333] py-12 mb-5">
                    <div className="text-center px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-white">Book Appointment</h1>
                        <p className="text-white mt-2">Schedule your consultation with Dr. {doctor.firstName} {doctor.lastName}</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Doctor Summary Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={doctor.image}
                                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Dr. {doctor.firstName} {doctor.lastName}
                                        </h2>
                                        <p className="text-gray-600">{doctor.specialty}</p>
                                        <div className="flex items-center mt-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                                            <span className="mx-2">•</span>
                                            <span className="text-sm text-gray-600">{doctor.yearsOfExperience} years exp</span>
                                            <span className="mx-2">•</span>
                                            <span className="text-sm font-semibold text-green-600">₹{doctor.consultationFee}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600 text-sm">{doctor.bio}</p>
                            </div>

                            {/* Appointment Type */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Type</h3>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setAppointmentType('clinic')}
                                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${appointmentType === 'clinic'
                                            ? 'border-green-600 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="font-semibold">Clinic Visit</div>
                                        <div className="text-sm text-gray-500">In-person consultation</div>
                                    </button>
                                    <button
                                        onClick={() => setAppointmentType('video')}
                                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${appointmentType === 'video'
                                            ? 'border-green-600 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="font-semibold">Video Consult</div>
                                        <div className="text-sm text-gray-500">Online consultation</div>
                                    </button>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                                    {availableDates.map((date) => (
                                        <button
                                            key={date}
                                            onClick={() => handleDateChange(date)}
                                            className={`py-3 px-2 rounded-lg text-center transition-all ${selectedDate === date
                                                ? 'bg-green-600 text-white shadow-md'
                                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <div className="text-xs font-medium">
                                                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </div>
                                            <div className="text-lg font-semibold">
                                                {new Date(date).getDate()}
                                            </div>
                                            <div className="text-xs">
                                                {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slot Selection */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Select Time Slot</h3>
                                    {bookedSlotsCount > 0 && (
                                        <span className="text-sm text-orange-600">
                                            {bookedSlotsCount} of {totalSlots} slots booked
                                        </span>
                                    )}
                                </div>

                                {availableSlotsCount === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-500 mb-2">No available slots for this date</div>
                                        <p className="text-sm text-gray-400">All slots are booked. Please select another date.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-3 text-sm text-green-600">
                                            {availableSlotsCount} slot{availableSlotsCount !== 1 ? 's' : ''} available
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {timeSlots.map((slot) => (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => handleSlotSelect(slot)}
                                                    disabled={slot.isBooked}
                                                    className={`py-2 px-3 rounded-lg border transition-all ${selectedSlot === slot.time
                                                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold ring-2 ring-green-200'
                                                        : slot.isBooked
                                                            ? 'border-red-200 bg-red-50 text-gray-400 cursor-not-allowed line-through'
                                                            : 'border-gray-200 hover:border-green-400 hover:bg-green-50 hover:text-green-700'
                                                        }`}
                                                >
                                                    {slot.time}
                                                    {slot.isBooked && (
                                                        <span className="ml-1 text-xs">(Booked)</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Patient Form */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Details</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Booking for
                                    </label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                value="self"
                                                checked={formData.bookingFor === 'self'}
                                                onChange={() => handleBookingForChange('self')}
                                                className="mr-2 text-green-600 focus:ring-green-500"
                                            />
                                            <span>Self</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                value="family"
                                                checked={formData.bookingFor === 'family'}
                                                onChange={() => handleBookingForChange('family')}
                                                className="mr-2 text-green-600 focus:ring-green-500"
                                            />
                                            <span>Family Member</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {formData.bookingFor === 'self' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={currentUser.name}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Patient Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="patientName"
                                                    value={formData.patientName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                    placeholder="Enter patient name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Age *
                                                </label>
                                                <input
                                                    type="number"
                                                    name="patientAge"
                                                    value={formData.patientAge}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                    placeholder="0-150"
                                                    min="0"
                                                    max="150"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="patientPhone"
                                                    value={formData.patientPhone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                    placeholder="10-digit mobile number"
                                                    maxLength="10"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Symptoms / Reason for visit *
                                        </label>
                                        <textarea
                                            name="symptoms"
                                            value={formData.symptoms}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                            placeholder="Please describe your symptoms..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleBooking}
                                disabled={bookingLoading || availableSlotsCount === 0 || !selectedSlot}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                            >
                                {bookingLoading ? 'Processing...' : 'Proceed to Confirm'}
                            </button>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Doctor</span>
                                        <span className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Specialty</span>
                                        <span className="font-medium">{doctor.specialty}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type</span>
                                        <span className="font-medium capitalize">{appointmentType}</span>
                                    </div>
                                    {selectedDate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date</span>
                                            <span className="font-medium">{formatDate(selectedDate)}</span>
                                        </div>
                                    )}
                                    {selectedSlot && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time</span>
                                            <span className="font-medium text-green-600">{selectedSlot}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-3 border-t border-gray-300/80">
                                        <span className="text-gray-900 font-semibold">Total Amount</span>
                                        <span className="text-green-600 font-bold text-lg">₹{doctor.consultationFee}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal - Fixed positioning */}
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmBooking}
                title="Confirm Appointment"
                loading={bookingLoading}
            >
                <div className="space-y-3">
                    <p className="text-gray-600">Please confirm your appointment details:</p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Doctor:</span>
                            <span className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{formatDate(selectedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium text-green-600">{selectedSlot}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium capitalize">{appointmentType === 'clinic' ? 'Clinic Visit' : 'Video Consultation'}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-300/80">
                            <span className="font-semibold">Amount:</span>
                            <span className="font-bold text-green-600">₹{doctor.consultationFee}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Click confirm to complete your booking.</p>
                </div>
            </ConfirmationModal>
        </>
    );
};