import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format, parseISO, isBefore, startOfDay, addDays, differenceInYears } from 'date-fns';
import ConfirmationModal from "../../components/patient/patientComponent/ConfirmationModal";
import Loader from "../../components/common/Loader";
import AuthContext from '../../context/AuthContext';
import { fetchAvailableSlots, bookAppointmentService } from '../../services/appointment.service';
import { getDoctorByIdService } from "../../services/doctor.service";

export default function BookAppointmentPage() {
    const { doctor_id } = useParams();
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    // State management
    const [doctor, setDoctor] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [appointmentType, setAppointmentType] = useState('clinic');
    const [formData, setFormData] = useState({
        bookingFor: 'self',
        patientName: '',
        patientAge: '',
        patientGender: '',
        patientPhone: '', // Added phone for family booking
        relation: 'self',
        symptoms: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Helper function to calculate age from DOB
    const calculateAgeFromDOB = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) return null;
        return differenceInYears(new Date(), birthDate);
    };

    // Get patient age for self booking
    const getPatientAge = () => {
        if (loginUser?.dob) {
            return calculateAgeFromDOB(loginUser.dob);
        }
        return null;
    };

    // Fetch doctor details from API
    const fetchDoctorDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getDoctorByIdService(doctor_id);

            if (res.data?.success && res.data?.data) {
                setDoctor(res.data.data);
            } else {
                setError('Doctor not found');
            }
        } catch (err) {
            console.error('Error fetching doctor:', err);
            setError('Failed to load doctor details');
        } finally {
            setIsLoading(false);
        }
    }, [doctor_id]);

    // Generate available dates based on doctor's schedule
    const generateAvailableDates = useCallback((doctorData) => {
        if (!doctorData?.availableDays) return [];

        const dates = [];
        const today = startOfDay(new Date());

        for (let i = 0; i < 30; i++) {
            const date = addDays(today, i);
            const dayName = format(date, 'EEEE').toLowerCase();

            if (doctorData.availableDays.includes(dayName)) {
                dates.push(format(date, 'yyyy-MM-dd'));
            }

            if (dates.length >= 14) break;
        }

        return dates;
    }, []);

    // Load doctor data on component mount
    useEffect(() => {
        fetchDoctorDetails();
    }, [fetchDoctorDetails]);

    // Generate available dates when doctor loads
    useEffect(() => {
        if (doctor?.availableDays) {
            const dates = generateAvailableDates(doctor);
            setAvailableDates(dates);
            if (dates.length > 0) {
                setSelectedDate(dates[0]);
            }
        }
    }, [doctor, generateAvailableDates]);

    useEffect(() => {
        let isMounted = true;

        const loadTimeSlots = async () => {
            if (!doctor || !selectedDate) {
                if (isMounted) {
                    setTimeSlots([]);
                    setSelectedSlot(null);
                }
                return;
            }

            try {
                if (isMounted) setLoadingSlots(true);
                const response = await fetchAvailableSlots(doctor._id, selectedDate);

                if (isMounted && response.data.success) {
                    // Update to handle both available and booked slots
                    const slots = response.data.slots.map(slot => ({
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        displayTime: format(parseISO(slot.startTime), 'h:mm a'),
                        isBooked: slot.isBooked || false
                    }));
                    setTimeSlots(slots);
                    setSelectedSlot(null);
                    setError('');
                } else if (isMounted) {
                    setTimeSlots([]);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching slots:', err);
                    setError(err.response?.data?.message || 'Failed to load available time slots');
                    setTimeSlots([]);
                }
            } finally {
                if (isMounted) setLoadingSlots(false);
            }
        };

        loadTimeSlots();

        return () => { isMounted = false; };
    }, [doctor, selectedDate]);

    // Handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        setError('');
    };

    // Handle slot selection
    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
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
            relation: value,
            patientName: value === 'self' ? `${loginUser?.firstName || ''} ${loginUser?.lastName || ''}` : '',
            patientAge: value === 'self' ? (getPatientAge() || '') : '',
            patientGender: value === 'self' ? (loginUser?.gender || '') : '',
            patientPhone: value === 'self' ? (loginUser?.mobile || '') : ''
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
            if (!formData.patientName?.trim()) {
                setError('Please enter patient name');
                return false;
            }
            if (!formData.patientAge || formData.patientAge < 0 || formData.patientAge > 150) {
                setError('Please enter valid age (0-150)');
                return false;
            }
            if (!formData.patientGender) {
                setError('Please select gender');
                return false;
            }
            if (!formData.patientPhone || !/^\d{10}$/.test(formData.patientPhone)) {
                setError('Please enter valid 10-digit phone number');
                return false;
            }
        }

        if (!formData.symptoms?.trim()) {
            setError('Please describe your symptoms');
            return false;
        }

        return true;
    };

    // Handle booking submission
    const handleBooking = () => {
        if (!validateForm()) return;
        setShowModal(true);
    };

    // Generate meeting link for video consultation
    const generateMeetingLink = () => {
        const meetingId = `${doctor._id}_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
        return `https://meet.example.com/${meetingId}`;
    };

    const confirmBooking = async () => {
        setBookingLoading(true);
        setError('');

        try {
            // Prepare patient details based on booking type
            let patientDetailsObj;

            if (formData.bookingFor === 'self') {
                patientDetailsObj = {
                    name: `${loginUser?.firstName || ''} ${loginUser?.lastName || ''}`.trim(),
                    age: getPatientAge(),
                    gender: loginUser?.gender || 'not specified',
                    relation: 'self'
                };
            } else {
                patientDetailsObj = {
                    name: formData.patientName.trim(),
                    age: parseInt(formData.patientAge),
                    gender: formData.patientGender,
                    relation: formData.relation,
                    phone: formData.patientPhone // Add phone for family member
                };
            }

            // Prepare location data
            const locationData = {
                city: doctor?.clinicCity || '',
                state: doctor?.clinicState || '',
                fullAddress: doctor?.clinicAddress || `${doctor?.clinicCity || ''} ${doctor?.clinicState || ''}`.trim()
            };

            const appointmentData = {
                doctorId: doctor._id,
                appointmentDate: selectedDate,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime,
                appointmentType: appointmentType,
                symptoms: formData.symptoms,
                patientDetails: patientDetailsObj,
                location: locationData,
                ...(appointmentType === 'video' && { meetingLink: generateMeetingLink() })
            };

            console.log('Booking data being sent:', appointmentData); // For debugging

            const response = await bookAppointmentService(appointmentData);

            if (response.data.success) {
                toast.success('Appointment booked successfully!');

                // Show meeting link for video consultation
                if (appointmentType === 'video' && response.data.data?.meetingLink) {
                    toast.success(`Meeting link: ${response.data.data.meetingLink}`, {
                        duration: 10000,
                    });
                }

                // Reset form
                setSelectedSlot(null);
                setFormData({
                    bookingFor: 'self',
                    patientName: '',
                    patientAge: '',
                    patientGender: '',
                    patientPhone: '',
                    relation: 'self',
                    symptoms: ''
                });
                setShowModal(false);

                // Navigate to my appointments
                navigate('/p/my-appointments');
            } else {
                throw new Error(response.data.message || 'Booking failed');
            }
        } catch (err) {
            console.error('Booking error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to book appointment';
            setError(errorMsg);
            toast.error(errorMsg);
            setShowModal(false);
        } finally {
            setBookingLoading(false);
        }
    };

    // Helper functions
    const formatDateDisplay = (dateString) => {
        return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    };

    const isDatePast = (dateString) => {
        return isBefore(parseISO(dateString), startOfDay(new Date()));
    };

    // Loading state
    if (isLoading) {
        return <Loader size="lg" color="green" fullScreen text="Loading doctor details..." />;
    }

    // Doctor not found
    if (error === 'Doctor not found' || !doctor) {
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
    if (availableDates.length === 0 && !isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Availability</h2>
                    <p className="text-gray-600 mb-4">This doctor has no available appointments in the next 30 days.</p>
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
                        <p className="text-white mt-2">Schedule your consultation with Dr. {doctor?.firstName} {doctor?.lastName}</p>
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
                                        src={doctor?.profilePhoto || `https://ui-avatars.com/api/?name=${doctor?.firstName}+${doctor?.lastName}&background=10b981&color=fff`}
                                        alt={`Dr. ${doctor?.firstName} ${doctor?.lastName}`}
                                        className="w-20 h-20 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${doctor?.firstName}+${doctor?.lastName}&background=10b981&color=fff`;
                                        }}
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Dr. {doctor?.firstName} {doctor?.lastName}
                                        </h2>
                                        <p className="text-gray-600">{doctor?.specialty}</p>
                                        <div className="flex items-center mt-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-sm text-gray-600 ml-1">{doctor?.rating || 0}</span>
                                            <span className="mx-2">•</span>
                                            <span className="text-sm text-gray-600">{doctor?.yearsOfExperience} years exp</span>
                                            <span className="mx-2">•</span>
                                            <span className="text-sm font-semibold text-green-600">₹{doctor?.consultationFee}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600 text-sm">{doctor?.bio}</p>
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
                                    {availableDates.map((date) => {
                                        const isPast = isDatePast(date);
                                        return (
                                            <button
                                                key={date}
                                                onClick={() => !isPast && handleDateChange(date)}
                                                disabled={isPast}
                                                className={`py-3 px-2 rounded-lg text-center transition-all ${selectedDate === date
                                                    ? 'bg-green-600 text-white shadow-md'
                                                    : isPast
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                <div className="text-xs font-medium">
                                                    {format(parseISO(date), 'EEE')}
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    {format(parseISO(date), 'd')}
                                                </div>
                                                <div className="text-xs">
                                                    {format(parseISO(date), 'MMM')}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slot Selection */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Select Time Slot</h3>
                                    {loadingSlots && <span className="text-sm text-gray-500">Loading slots...</span>}
                                </div>

                                {!selectedDate ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-500 mb-2">Please select a date first</div>
                                    </div>
                                ) : loadingSlots ? (
                                    <div className="flex justify-center py-8">
                                        <Loader size="md" />
                                    </div>
                                ) : timeSlots.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-500 mb-2">No slots available for this date</div>
                                        <p className="text-sm text-gray-400">Please select another date.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Show statistics */}
                                        <div className="mb-3 flex justify-between items-center text-sm">
                                            <span className="text-green-600">
                                                {timeSlots.filter(slot => !slot.isBooked).length} slot{timeSlots.filter(slot => !slot.isBooked).length !== 1 ? 's' : ''} available
                                            </span>
                                            {timeSlots.filter(slot => slot.isBooked).length > 0 && (
                                                <span className="text-red-500">
                                                    {timeSlots.filter(slot => slot.isBooked).length} slot{timeSlots.filter(slot => slot.isBooked).length !== 1 ? 's' : ''} booked
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {timeSlots.map((slot, index) => {
                                                const isSelected = selectedSlot?.startTime === slot.startTime;
                                                const isBooked = slot.isBooked;

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => !isBooked && handleSlotSelect(slot)}
                                                        disabled={isBooked}
                                                        className={`
                                py-2 px-3 rounded-lg border transition-all relative
                                ${isSelected && !isBooked
                                                                ? 'border-green-600 bg-green-50 text-green-700 font-semibold ring-2 ring-green-200'
                                                                : isBooked
                                                                    ? 'border-red-200 bg-red-50 text-gray-400 cursor-not-allowed line-through'
                                                                    : 'border-gray-200 hover:border-green-400 hover:bg-green-50 hover:text-green-700'
                                                            }
                            `}
                                                    >
                                                        {slot.displayTime}
                                                        {isBooked && (
                                                            <span className="absolute -top-2 -right-2">
                                                                <span className="relative flex h-3 w-3">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                                </span>
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Legend */}
                                        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-4 text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                                                <span className="text-gray-600">Available</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded line-through"></div>
                                                <span className="text-gray-600">Booked</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-green-600 rounded"></div>
                                                <span className="text-gray-600">Selected</span>
                                            </div>
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
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={`${loginUser?.firstName || ''} ${loginUser?.lastName || ''}`}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Age
                                                </label>
                                                <input
                                                    type="text"
                                                    value={getPatientAge() || 'Not specified'}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Gender
                                                </label>
                                                <input
                                                    type="text"
                                                    value={loginUser?.gender || 'Not specified'}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            </div>
                                        </>
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
                                                    Gender *
                                                </label>
                                                <select
                                                    name="patientGender"
                                                    value={formData.patientGender}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
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

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Relation *
                                                </label>
                                                <select
                                                    name="relation"
                                                    value={formData.relation}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                >
                                                    <option value="self">Self</option>
                                                    <option value="father">Father</option>
                                                    <option value="mother">Mother</option>
                                                    <option value="spouse">Spouse</option>
                                                    <option value="child">Child</option>
                                                    <option value="other">Other</option>
                                                </select>
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
                                disabled={bookingLoading || loadingSlots || timeSlots.length === 0 || !selectedSlot}
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
                                        <span className="font-medium">Dr. {doctor?.firstName} {doctor?.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Specialty</span>
                                        <span className="font-medium">{doctor?.specialty}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type</span>
                                        <span className="font-medium capitalize">{appointmentType === 'clinic' ? 'Clinic Visit' : 'Video Consultation'}</span>
                                    </div>
                                    {selectedDate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date</span>
                                            <span className="font-medium">{formatDateDisplay(selectedDate)}</span>
                                        </div>
                                    )}
                                    {selectedSlot && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time</span>
                                            <span className="font-medium text-green-600">{selectedSlot.displayTime}</span>
                                        </div>
                                    )}
                                    {formData.bookingFor === 'family' && formData.patientName && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Patient</span>
                                            <span className="font-medium">{formData.patientName}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-3 border-t border-gray-300/80">
                                        <span className="text-gray-900 font-semibold">Total Amount</span>
                                        <span className="text-green-600 font-bold text-lg">₹{doctor?.consultationFee}</span>
                                    </div>

                                    {/* Add this in the Summary Sidebar after the Total Amount section */}
                                    {timeSlots.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 mb-2">Slot Availability</p>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Available:</span>
                                                <span className="text-green-600 font-semibold">
                                                    {timeSlots.filter(s => !s.isBooked).length}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs mt-1">
                                                <span className="text-gray-500">Booked:</span>
                                                <span className="text-red-500 font-semibold">
                                                    {timeSlots.filter(s => s.isBooked).length}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs mt-1">
                                                <span className="text-gray-500">Total:</span>
                                                <span className="text-gray-700 font-semibold">
                                                    {timeSlots.length}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
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
                            <span className="font-medium">Dr. {doctor?.firstName} {doctor?.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{selectedDate && formatDateDisplay(selectedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium text-green-600">{selectedSlot?.displayTime}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium capitalize">{appointmentType === 'clinic' ? 'Clinic Visit' : 'Video Consultation'}</span>
                        </div>
                        {appointmentType === 'video' && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Meeting Link:</span>
                                <span className="font-medium text-blue-600 text-xs">Will be generated after confirmation</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-300/80">
                            <span className="font-semibold">Amount:</span>
                            <span className="font-bold text-green-600">₹{doctor?.consultationFee}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Click confirm to complete your booking.</p>
                </div>
            </ConfirmationModal>
        </>
    );
}