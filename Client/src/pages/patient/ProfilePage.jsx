// PatientProfile.jsx

import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Heart,
    Droplet,
    Ruler,
    Weight,
    AlertCircle,
    Pill,
    FileText,
    Users,
    Lock,
    Edit2,
    Save,
    X,
    Activity
} from 'lucide-react';

export default function PatientProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [formData, setFormData] = useState({
        // Personal Information
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        address: '123 Healthcare Ave, Medical District, NY 10001',

        // Medical Information
        bloodGroup: 'O+',
        height: 175,
        weight: 72,
        allergies: 'Pollen, Penicillin',
        currentMedications: 'Lisinopril 10mg (once daily), Metformin 500mg (twice daily)',
        medicalHistory: 'Hypertension (diagnosed 2020), Type 2 Diabetes (diagnosed 2022)',

        // Emergency Contact
        emergencyName: 'Sarah Doe',
        emergencyRelation: 'Spouse',
        emergencyPhone: '+1 (555) 987-6543'
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate phone number
    const validatePhone = (phone) => {
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
        return phoneRegex.test(phone);
    };

    // Handle save
    const handleSave = () => {
        const newErrors = {};

        // Validate phone numbers
        if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!validatePhone(formData.emergencyPhone)) {
            newErrors.emergencyPhone = 'Please enter a valid emergency phone number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Save logic here (API call)
        console.log('Saving profile data:', formData);
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    // Handle cancel
    const handleCancel = () => {
        // Reset to original data (in real app, fetch from API)
        setIsEditing(false);
        setErrors({});
    };

    // Info Row Component for View Mode
    const InfoRow = ({ label, value, icon: Icon }) => (
        <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                <Icon className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
            </div>
            <div className="sm:w-2/3">
                <span className="text-sm text-gray-900 dark:text-white">{value || 'Not specified'}</span>
            </div>
        </div>
    );

    // Editable Field Component for Edit Mode
    const EditableField = ({ label, name, value, type = 'text', icon: Icon, required, rows }) => {
        const isTextarea = type === 'textarea';

        return (
            <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                    <Icon className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
                    {required && <span className="text-red-500 ml-1">*</span>}
                </div>
                <div className="sm:w-2/3">
                    {isTextarea ? (
                        <textarea
                            name={name}
                            value={value}
                            onChange={handleChange}
                            rows={rows || 3}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder={`Enter ${label.toLowerCase()}`}
                        />
                    ) : (
                        <input
                            type={type}
                            name={name}
                            value={value}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder={`Enter ${label.toLowerCase()}`}
                        />
                    )}
                    {errors[name] && (
                        <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
                    )}
                </div>
            </div>
        );
    };

    // Section Header Component
    const SectionHeader = ({ title, icon: Icon }) => (
        <div className="flex items-center mb-4 pb-2 border-b-2 border-green-200 dark:border-green-800">
            <Icon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {formData.firstName[0]}{formData.lastName[0]}
                                    </span>
                                </div>
                                {/* Future: Upload button */}
                                <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                    <Edit2 className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formData.firstName} {formData.lastName}
                                </h1>
                                <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                                    <Mail className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{formData.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Edit/Save Buttons */}
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="mt-4 sm:mt-0 flex space-x-3">
                                <button
                                    onClick={handleCancel}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left Column */}
                    <div className="space-y-6">

                        {/* Personal Information Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <SectionHeader title="Personal Information" icon={User} />

                            {!isEditing ? (
                                // View Mode
                                <div>
                                    <InfoRow label="First Name" value={formData.firstName} icon={User} />
                                    <InfoRow label="Last Name" value={formData.lastName} icon={User} />
                                    <InfoRow label="Phone" value={formData.phone} icon={Phone} />
                                    <InfoRow label="Email" value={formData.email} icon={Mail} />
                                    <InfoRow label="Date of Birth" value={formData.dateOfBirth} icon={Calendar} />
                                    <InfoRow label="Gender" value={formData.gender} icon={User} />
                                    <InfoRow label="Address" value={formData.address} icon={MapPin} />
                                </div>
                            ) : (
                                // Edit Mode
                                <div>
                                    <EditableField label="First Name" name="firstName" value={formData.firstName} icon={User} required />
                                    <EditableField label="Last Name" name="lastName" value={formData.lastName} icon={User} required />
                                    <EditableField label="Phone" name="phone" value={formData.phone} type="tel" icon={Phone} required />
                                    <InfoRow label="Email" value={formData.email} icon={Mail} /> {/* Email is read-only */}
                                    <EditableField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} type="date" icon={Calendar} />
                                    <EditableField label="Gender" name="gender" value={formData.gender} icon={User} />
                                    <EditableField label="Address" name="address" value={formData.address} type="textarea" rows={2} icon={MapPin} />
                                </div>
                            )}
                        </div>

                        {/* Emergency Contact Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <SectionHeader title="Emergency Contact" icon={Users} />

                            {!isEditing ? (
                                <div>
                                    <InfoRow label="Contact Name" value={formData.emergencyName} icon={User} />
                                    <InfoRow label="Relation" value={formData.emergencyRelation} icon={Users} />
                                    <InfoRow label="Emergency Phone" value={formData.emergencyPhone} icon={Phone} />
                                </div>
                            ) : (
                                <div>
                                    <EditableField label="Contact Name" name="emergencyName" value={formData.emergencyName} icon={User} required />
                                    <EditableField label="Relation" name="emergencyRelation" value={formData.emergencyRelation} icon={Users} required />
                                    <EditableField label="Emergency Phone" name="emergencyPhone" value={formData.emergencyPhone} type="tel" icon={Phone} required />
                                </div>
                            )}
                        </div>

                        {/* Password Section Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <SectionHeader title="Security" icon={Lock} />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Lock className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Password</span>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-500">••••••••</span>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">

                        {/* Medical Information Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <SectionHeader title="Medical Information" icon={Heart} />

                            {!isEditing ? (
                                <div>
                                    <InfoRow label="Blood Group" value={formData.bloodGroup} icon={Droplet} />
                                    <InfoRow label="Height" value={formData.height ? `${formData.height} cm` : null} icon={Ruler} />
                                    <InfoRow label="Weight" value={formData.weight ? `${formData.weight} kg` : null} icon={Weight} />
                                    <InfoRow label="Allergies" value={formData.allergies} icon={AlertCircle} />
                                    <InfoRow label="Current Medications" value={formData.currentMedications} icon={Pill} />
                                    <InfoRow label="Medical History" value={formData.medicalHistory} icon={FileText} />
                                </div>
                            ) : (
                                <div>
                                    <EditableField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} icon={Droplet} />
                                    <EditableField label="Height (cm)" name="height" value={formData.height} type="number" icon={Ruler} />
                                    <EditableField label="Weight (kg)" name="weight" value={formData.weight} type="number" icon={Weight} />
                                    <EditableField label="Allergies" name="allergies" value={formData.allergies} type="textarea" rows={2} icon={AlertCircle} />
                                    <EditableField label="Current Medications" name="currentMedications" value={formData.currentMedications} type="textarea" rows={3} icon={Pill} />
                                    <EditableField label="Medical History" name="medicalHistory" value={formData.medicalHistory} type="textarea" rows={3} icon={FileText} />
                                </div>
                            )}
                        </div>

                        {/* Health Summary Card (Future Scope Preview) */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl shadow-sm border border-green-100 dark:border-green-800 p-6">
                            <div className="flex items-center mb-3">
                                <Activity className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Health Summary</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">BMI</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {(formData.weight / ((formData.height / 100) ** 2)).toFixed(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Checkup</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Feb 15, 2024</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Next Appointment</span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Mar 10, 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Handle password change
                                    setShowPasswordModal(false);
                                    alert('Password changed successfully!');
                                }}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}