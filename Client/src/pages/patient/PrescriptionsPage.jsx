import React, { useState, useEffect } from 'react';
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
    FileSignature
} from 'lucide-react';
import { doctorsData, dummyAppointments } from '../../utils/data';
import { formatDate } from '../../utils/dateUtils';

// Mock prescriptions data
const generateMockPrescriptions = () => {
    return [
        {
            id: 1001,
            appointmentId: 201,
            doctorId: 1,
            patientId: 101,
            patientName: 'John Doe',
            patientRelation: 'Self',
            date: '2026-02-15',
            appointmentType: 'video',
            notes: 'Patient showed significant improvement in blood pressure levels. Continue current medication and monitor regularly. Follow up in 2 weeks for blood work.',
            medicines: [
                {
                    id: 1,
                    name: 'Lisinopril',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    duration: '30 days',
                    instructions: 'Take in the morning with or without food. Avoid taking with high-potassium foods.',
                    quantity: '30 tablets',
                    refills: 2
                },
                {
                    id: 2,
                    name: 'Metformin',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    duration: '30 days',
                    instructions: 'Take with meals to reduce stomach upset. Monitor blood sugar regularly.',
                    quantity: '60 tablets',
                    refills: 3
                }
            ]
        },
        {
            id: 1002,
            appointmentId: 202,
            doctorId: 3,
            patientId: 101,
            patientName: 'John Doe',
            patientRelation: 'Self',
            date: '2026-01-20',
            appointmentType: 'clinic',
            notes: 'Mild gum inflammation detected. Prescribed antibiotics and advised improved oral hygiene routine. Schedule cleaning in 1 month.',
            medicines: [
                {
                    id: 3,
                    name: 'Amoxicillin',
                    dosage: '500mg',
                    frequency: 'Three times daily',
                    duration: '7 days',
                    instructions: 'Take every 8 hours. Complete full course even if symptoms improve.',
                    quantity: '21 capsules',
                    refills: 0
                },
                {
                    id: 4,
                    name: 'Chlorhexidine Mouthwash',
                    dosage: '0.12%',
                    frequency: 'Twice daily',
                    duration: '14 days',
                    instructions: 'Swish for 30 seconds after brushing. Do not swallow. Use for 2 weeks only.',
                    quantity: '1 bottle (500ml)',
                    refills: 0
                }
            ]
        },
        {
            id: 1003,
            appointmentId: 203,
            doctorId: 2,
            patientId: 102, // Family member
            patientName: 'Sarah Doe',
            patientRelation: 'Spouse',
            patientAge: 32,
            date: '2026-02-10',
            appointmentType: 'video',
            notes: 'Migraine triggered by stress and lack of sleep. Prescribed triptans for acute attacks. Recommend stress management techniques and maintaining sleep schedule.',
            medicines: [
                {
                    id: 5,
                    name: 'Sumatriptan',
                    dosage: '50mg',
                    frequency: 'As needed',
                    duration: 'For acute attacks',
                    instructions: 'Take at first sign of migraine. Maximum 200mg in 24 hours. Do not exceed 10 days per month.',
                    quantity: '9 tablets',
                    refills: 1
                },
                {
                    id: 6,
                    name: 'Magnesium Glycinate',
                    dosage: '400mg',
                    frequency: 'Once daily',
                    duration: '90 days',
                    instructions: 'Take at night before bed. May help prevent migraine attacks.',
                    quantity: '90 capsules',
                    refills: 2
                }
            ]
        },
        {
            id: 1004,
            appointmentId: 204,
            doctorId: 4,
            patientId: 101,
            patientName: 'John Doe',
            patientRelation: 'Self',
            date: '2026-01-05',
            appointmentType: 'clinic',
            notes: 'Seasonal allergies causing significant discomfort. Continue current regimen and avoid known triggers. Consider allergy testing if symptoms persist.',
            medicines: [
                {
                    id: 7,
                    name: 'Loratadine',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    duration: '30 days',
                    instructions: 'Take at the same time each day. May cause drowsiness in some individuals.',
                    quantity: '30 tablets',
                    refills: 2
                },
                {
                    id: 8,
                    name: 'Fluticasone Nasal Spray',
                    dosage: '50mcg/spray',
                    frequency: 'Twice daily',
                    duration: '30 days',
                    instructions: 'Prime before first use. Spray into each nostril daily. May take several days for full effect.',
                    quantity: '1 bottle (120 sprays)',
                    refills: 1
                }
            ]
        }
    ];
};

export default function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFamily, setFilterFamily] = useState('all'); // 'all', 'self', 'family'
    const [expandedPrescription, setExpandedPrescription] = useState(null);

    // Current logged-in user ID (simulated)
    const currentUserId = 101;

    useEffect(() => {
        // Load prescriptions
        setTimeout(() => {
            const allPrescriptions = generateMockPrescriptions();
            // Filter prescriptions for current user and family members
            const userPrescriptions = allPrescriptions.filter(
                pres => pres.patientId === currentUserId || pres.patientRelation !== 'Self'
            );
            // Sort by date (latest first)
            userPrescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPrescriptions(userPrescriptions);
            setFilteredPrescriptions(userPrescriptions);
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        // Filter prescriptions based on search and family filter
        let filtered = prescriptions;

        if (searchTerm) {
            filtered = filtered.filter(pres =>
                pres.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pres.medicines?.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (filterFamily === 'self') {
            filtered = filtered.filter(pres => pres.patientRelation === 'Self');
        } else if (filterFamily === 'family') {
            filtered = filtered.filter(pres => pres.patientRelation !== 'Self');
        }

        setFilteredPrescriptions(filtered);
    }, [searchTerm, filterFamily, prescriptions]);

    // Get doctor details for a prescription
    const getDoctorDetails = (doctorId) => {
        const doctor = doctorsData.find(doc => doc.id === doctorId);
        return {
            name: doctor?.name || 'Dr. Unknown',
            specialty: doctor?.specialty || 'General Physician',
            experience: doctor?.experience || 'N/A',
            image: doctor?.image || 'https://via.placeholder.com/80'
        };
    };

    // Get appointment details
    const getAppointmentDetails = (appointmentId) => {
        const appointment = dummyAppointments.find(apt => apt.id === appointmentId);
        return {
            time: appointment?.time || 'Not specified',
            meetingLink: appointment?.meetingLink || null
        };
    };

    // Enrich prescriptions with doctor and appointment data
    const enrichPrescriptions = () => {
        return filteredPrescriptions.map(pres => ({
            ...pres,
            doctor: getDoctorDetails(pres.doctorId),
            appointment: getAppointmentDetails(pres.appointmentId)
        }));
    };

    const enrichedPrescriptions = enrichPrescriptions();

    // Handle view details
    const handleViewDetails = (prescription) => {
        setSelectedPrescription(prescription);
        setShowDetailsModal(true);
    };

    // Handle download prescription (mock)
    const handleDownload = (prescription) => {
        alert(`Downloading prescription #${prescription.id} as PDF...`);
        // In real implementation, generate PDF here
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    // Get status color/icon for prescription age
    const getPrescriptionStatus = (date) => {
        const daysOld = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (daysOld <= 7) return { label: 'Active', color: 'text-green-600 bg-green-100 dark:bg-green-900/30', icon: CheckCircle };
        if (daysOld <= 30) return { label: 'Current', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30', icon: Clock };
        return { label: 'Archived', color: 'text-gray-600 bg-gray-100 dark:bg-gray-700', icon: FileText };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-500"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading prescriptions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center">
                                <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prescriptions</h1>
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
                                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <select
                                value={filterFamily}
                                onChange={(e) => setFilterFamily(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">All Prescriptions</option>
                                <option value="self">My Prescriptions</option>
                                <option value="family">Family Prescriptions</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {enrichedPrescriptions.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                        <FileText className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Prescriptions Available</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            You don't have any prescriptions yet. Prescriptions will appear here after your doctor's appointments.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {enrichedPrescriptions.map((prescription) => {
                            const status = getPrescriptionStatus(prescription.date);
                            const StatusIcon = status.icon;
                            const isExpanded = expandedPrescription === prescription.id;

                            return (
                                <div
                                    key={prescription.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <img
                                                        src={prescription.doctor.image}
                                                        alt={prescription.doctor.name}
                                                        className="w-12 h-12 rounded-full object-cover mr-3"
                                                    />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            {prescription.doctor.name}
                                                        </h3>
                                                        <p className="text-sm text-green-600 dark:text-green-400">{prescription.doctor.specialty}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mt-3">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {formatDate(prescription.date)}
                                                    </div>
                                                    <div className="flex items-center">
                                                        {prescription.appointmentType === 'video' ? (
                                                            <Video className="w-4 h-4 mr-1" />
                                                        ) : (
                                                            <Stethoscope className="w-4 h-4 mr-1" />
                                                        )}
                                                        {prescription.appointmentType === 'video' ? 'Video Consult' : 'Clinic Visit'}
                                                    </div>
                                                    {prescription.patientRelation !== 'Self' && (
                                                        <div className="flex items-center">
                                                            <User className="w-4 h-4 mr-1" />
                                                            For: {prescription.patientName} ({prescription.patientRelation})
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
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
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Medicines Prescribed</span>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {prescription.medicines.length} medicine(s)
                                            </span>
                                        </div>

                                        {/* Medicine Preview */}
                                        <div className="space-y-2">
                                            {prescription.medicines.slice(0, isExpanded ? undefined : 2).map((medicine, idx) => (
                                                <div key={medicine.id} className="flex items-start justify-between text-sm">
                                                    <div className="flex-1">
                                                        <span className="font-medium text-gray-900 dark:text-white">{medicine.name}</span>
                                                        <span className="text-gray-500 dark:text-gray-400 ml-2">{medicine.dosage}</span>
                                                        {!isExpanded && idx === 1 && prescription.medicines.length > 2 && (
                                                            <span className="text-xs text-gray-400 ml-2">
                                                                +{prescription.medicines.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{medicine.frequency}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                            <button
                                                onClick={() => setExpandedPrescription(isExpanded ? null : prescription.id)}
                                                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 font-medium flex items-center"
                                            >
                                                {isExpanded ? 'Show Less' : 'Show All Medicines'}
                                                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
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
                                                {prescription.medicines.map((medicine) => (
                                                    <div key={medicine.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white">{medicine.name}</h4>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{medicine.dosage}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-600 dark:text-gray-300">{medicine.frequency}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Duration: {medicine.duration}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">{medicine.instructions}</p>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center">
                                <FileSignature className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Prescription Details</h2>
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
                                            <img
                                                src={selectedPrescription.doctor.image}
                                                alt={selectedPrescription.doctor.name}
                                                className="w-12 h-12 rounded-full object-cover mr-3"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{selectedPrescription.doctor.name}</h3>
                                                <p className="text-sm text-green-600 dark:text-green-400">{selectedPrescription.doctor.specialty}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedPrescription.doctor.experience} experience</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm">
                                            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                                            <span className="text-gray-700 dark:text-gray-300">{formatDate(selectedPrescription.date)}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                                            <span className="text-gray-700 dark:text-gray-300">{selectedPrescription.appointment.time}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            {selectedPrescription.appointmentType === 'video' ? (
                                                <>
                                                    <Video className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                                                    <span className="text-gray-700 dark:text-gray-300">Video Consultation</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Stethoscope className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                                                    <span className="text-gray-700 dark:text-gray-300">Clinic Visit</span>
                                                </>
                                            )}
                                        </div>
                                        {selectedPrescription.patientRelation !== 'Self' && (
                                            <div className="flex items-center text-sm">
                                                <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    Patient: {selectedPrescription.patientName} ({selectedPrescription.patientRelation})
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
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Prescribed Medicines</h3>
                                </div>

                                <div className="space-y-4">
                                    {selectedPrescription.medicines.map((medicine) => (
                                        <div key={medicine.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">{medicine.name}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{medicine.dosage}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-900 dark:text-white">{medicine.frequency}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration: {medicine.duration}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-3">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                                                        <span className="ml-2 text-gray-900 dark:text-white">{medicine.quantity}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Refills:</span>
                                                        <span className="ml-2 text-gray-900 dark:text-white">{medicine.refills} remaining</span>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Instructions:</span>
                                                    <p className="text-sm text-gray-900 dark:text-white mt-1">{medicine.instructions}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Doctor Notes */}
                            <div>
                                <div className="flex items-center mb-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Doctor's Notes</h3>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                        {selectedPrescription.notes}
                                    </p>
                                </div>
                            </div>

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