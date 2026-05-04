// PatientDashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, Stethoscope, Bot, FileText, ChevronRight, Clock, CheckCircle, XCircle, Wallet, User, ArrowRight, Activity, Heart } from 'lucide-react';
import { doctorsData, dummyAppointments } from '../../utils/data';
import { formatDate } from '../../utils/dateUtils';

export default function PatientDashboard() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('John');
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Current logged-in user ID (simulated)
    const currentUserId = 101;
    
    useEffect(() => {
        // Load appointments for current user
        const userAppointments = dummyAppointments.filter(apt => apt.userId === currentUserId);
        setAppointments(userAppointments);
        setLoading(false);
        
        // Get user name from somewhere (simulated)
        setUserName('John');
        
        // Update date every minute
        const interval = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);
    
    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = currentDate.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };
    
    // Format current date
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Calculate statistics
    const stats = useMemo(() => {
        const upcoming = appointments.filter(apt => apt.status === 'upcoming');
        const completed = appointments.filter(apt => apt.status === 'completed');
        const cancelled = appointments.filter(apt => apt.status === 'cancelled');
        const totalSpent = completed.reduce((sum, apt) => sum + apt.consultationFee, 0);
        
        return {
            upcoming: upcoming.length,
            completed: completed.length,
            cancelled: cancelled.length,
            totalSpent
        };
    }, [appointments]);
    
    // Get upcoming appointments (sorted by nearest date)
    const upcomingAppointments = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return appointments
            .filter(apt => apt.status === 'upcoming' && apt.date >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3); // Show only next 3 appointments
    }, [appointments]);
    
    // Get recent symptoms from latest appointments
    const recentSymptoms = useMemo(() => {
        const recentApps = appointments
            .filter(apt => apt.symptoms)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        return recentApps.map(apt => ({
            symptom: apt.symptoms,
            date: apt.date,
            doctor: apt.doctorName
        }));
    }, [appointments]);
    
    // Get doctor details by ID
    const getDoctorDetails = (doctorId) => {
        return doctorsData.find(doc => doc.id === doctorId);
    };
    
    // Handle join video call
    const handleJoinCall = (meetingLink) => {
        window.open(meetingLink, '_blank');
    };
    
    // Handle view details
    const handleViewDetails = (appointment) => {
        navigate(`/appointment/${appointment.id}`);
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-500"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {getGreeting()}, {userName}! 👋
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your health overview</p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            <div className="flex items-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm dark:shadow-gray-900/30">
                                <Calendar className="w-5 h-5 mr-2 text-green-600 dark:text-green-500" />
                                <span className="text-sm font-medium">{formattedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Upcoming Appointments */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
                                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">{stats.upcoming}</span>
                        </div>
                        <h3 className="text-gray-700 dark:text-gray-300 font-medium">Upcoming Appointments</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Scheduled visits</p>
                    </div>
                    
                    {/* Completed Appointments */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2">
                                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">{stats.completed}</span>
                        </div>
                        <h3 className="text-gray-700 dark:text-gray-300 font-medium">Completed Appointments</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Successfully completed</p>
                    </div>
                    
                    {/* Cancelled Appointments */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
                                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">{stats.cancelled}</span>
                        </div>
                        <h3 className="text-gray-700 dark:text-gray-300 font-medium">Cancelled Appointments</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">No-shows or cancellations</p>
                    </div>
                    
                    {/* Total Spent */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2">
                                <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">₹{stats.totalSpent}</span>
                        </div>
                        <h3 className="text-gray-700 dark:text-gray-300 font-medium">Total Spent</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Lifetime consultation fees</p>
                    </div>
                </div>
                
                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Book Appointment */}
                        <button
                            onClick={() => navigate('/doctors')}
                            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all hover:border-green-200 dark:hover:border-green-800"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Book Appointment</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">Schedule a consultation</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </button>
                        
                        {/* Ask AI */}
                        <button
                            onClick={() => navigate('/ai-assistant')}
                            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all hover:border-green-200 dark:hover:border-green-800"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Ask AI Assistant</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">Get health insights</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </button>
                        
                        {/* View Reports */}
                        <button
                            onClick={() => navigate('/reports')}
                            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all hover:border-green-200 dark:hover:border-green-800"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">View Reports</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">Medical history & reports</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </button>
                    </div>
                </div>
                
                {/* Two Column Layout for Upcoming Appointments and Health Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Appointments Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
                            {upcomingAppointments.length > 0 && (
                                <button 
                                    onClick={() => navigate('/my-appointments')}
                                    className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center"
                                >
                                    View all
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            )}
                        </div>
                        
                        {upcomingAppointments.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Upcoming Appointments</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any scheduled appointments.</p>
                                <button
                                    onClick={() => navigate('/doctors')}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                                >
                                    Book Your First Appointment
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingAppointments.map((appointment) => {
                                    const doctor = getDoctorDetails(appointment.doctorId);
                                    const isVideo = appointment.appointmentType === 'video';
                                    const isForFamily = appointment.patientName && appointment.patientName !== 'John Doe';
                                    
                                    return (
                                        <div key={appointment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                {/* Doctor Image */}
                                                <div className="flex-shrink-0">
                                                    <img 
                                                        src={doctor?.image} 
                                                        alt={appointment.doctorName}
                                                        className="w-16 h-16 rounded-full object-cover"
                                                    />
                                                </div>
                                                
                                                {/* Appointment Details */}
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">{appointment.doctorName}</h3>
                                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                                            {appointment.specialty}
                                                        </span>
                                                        {isVideo ? (
                                                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full flex items-center">
                                                                <Video className="w-3 h-3 mr-1" />
                                                                Video
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full flex items-center">
                                                                <Stethoscope className="w-3 h-3 mr-1" />
                                                                Clinic
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {formatDate(appointment.date)}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            {appointment.time}
                                                        </div>
                                                        {isForFamily && (
                                                            <div className="flex items-center">
                                                                <User className="w-4 h-4 mr-1" />
                                                                For: {appointment.patientName} (Age: {appointment.patientAge})
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {appointment.symptoms && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                            Symptoms: {appointment.symptoms}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex-shrink-0">
                                                    {isVideo && appointment.meetingLink ? (
                                                        <button
                                                            onClick={() => handleJoinCall(appointment.meetingLink)}
                                                            className="w-full sm:w-auto inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                                                        >
                                                            <Video className="w-4 h-4 mr-2" />
                                                            Join Call
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleViewDetails(appointment)}
                                                            className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            View Details
                                                            <ChevronRight className="w-4 h-4 ml-2" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    {/* Health Summary Section */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Health Summary</h2>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            {recentSymptoms.length === 0 ? (
                                <div className="text-center py-8">
                                    <Activity className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">No health issues reported</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">You're doing great! 💪</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center mb-4">
                                        <Heart className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                                        <h3 className="font-medium text-gray-900 dark:text-white">Recent Symptoms</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {recentSymptoms.map((item, index) => (
                                            <div key={index} className="border-l-4 border-green-500 dark:border-green-400 pl-3 py-2">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{item.symptom}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.doctor}</span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(item.date)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            
                            {/* Health Tips Section */}
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">💡 Health Tip</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Regular health check-ups can help detect potential issues early. 
                                        Schedule your next preventive care visit today.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};