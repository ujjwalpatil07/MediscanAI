import React, { useState, useEffect, useCallback } from 'react';
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
    Users,
    Lock,
    Edit2,
    Save,
    X,
    Activity,
    Camera,
    CheckCircle,
    AlertTriangle,
    Loader
} from 'lucide-react';
import { getProfile, updateProfile, changePassword, sendOtp, verifyEmail } from '../../services/patient.service.js';
import toast from 'react-hot-toast';

export default function PatientProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        isEmailVerified: false,
        profilePhoto: '',
        dob: '',
        gender: '',
        address: '',
        bloodGroup: '',
        height: '',
        weight: '',
        allergies: '',
        currentMedications: [],
        emergencyContact: {
            name: '',
            relation: '',
            phone: ''
        }
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Fetch profile data
    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getProfile();
            if (response.data.success) {
                const data = response.data.data;
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    mobile: data.mobile || '',
                    email: data.email || '',
                    isEmailVerified: data.isEmailVerified || false,
                    profilePhoto: data.profilePhoto || '',
                    dob: data.dob ? data.dob.split('T')[0] : '',
                    gender: data.gender || '',
                    address: data.address || '',
                    bloodGroup: data.bloodGroup || '',
                    height: data.height || '',
                    weight: data.weight || '',
                    allergies: data.allergies ? data.allergies.join(', ') : '',
                    currentMedications: data.currentMedications || [],
                    emergencyContact: data.emergencyContact || {
                        name: '',
                        relation: '',
                        phone: ''
                    }
                });
            }
        } catch (error) {
            console.error('Fetch profile error:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Resend OTP cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Handle medication changes
    const handleMedicationChange = (index, field, value) => {
        const updated = [...formData.currentMedications];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, currentMedications: updated }));
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            currentMedications: [...prev.currentMedications, { name: '', dosage: '' }]
        }));
    };

    const removeMedication = (index) => {
        const updated = formData.currentMedications.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, currentMedications: updated }));
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        try {
            setUploadingPhoto(true);
            const formDataObj = new FormData();
            formDataObj.append('profilePhoto', file);
            const response = await updateProfile(formDataObj);
            if (response.data.success) {
                toast.success('Profile photo updated');
                await fetchProfile();
            }
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploadingPhoto(false);
        }
    };

    // Handle save
    const handleSave = async () => {
        try {
            setSaving(true);
            const updateData = new FormData();
            updateData.append('firstName', formData.firstName);
            updateData.append('lastName', formData.lastName);
            updateData.append('mobile', formData.mobile);
            if (formData.dob) updateData.append('dob', formData.dob);
            if (formData.gender) updateData.append('gender', formData.gender);
            if (formData.address) updateData.append('address', formData.address);
            if (formData.bloodGroup) updateData.append('bloodGroup', formData.bloodGroup);
            if (formData.height) updateData.append('height', formData.height);
            if (formData.weight) updateData.append('weight', formData.weight);
            updateData.append('allergies', JSON.stringify(formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : []));
            updateData.append('currentMedications', JSON.stringify(formData.currentMedications || []));
            updateData.append('emergencyContact', JSON.stringify(formData.emergencyContact || {}));
            const response = await updateProfile(updateData);
            if (response.data.success) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
                await fetchProfile();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setIsEditing(false);
        fetchProfile();
        setErrors({});
    };

    // Handle password change
    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        try {
            setChangingPassword(true);
            const response = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            if (response.data.success) {
                toast.success('Password updated');
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        } finally {
            setChangingPassword(false);
        }
    };

    // Handle send OTP
    const handleSendOtp = async () => {
        try {
            setSendingOtp(true);
            const response = await sendOtp();
            if (response.data.success) {
                setOtpSent(true);
                setResendCooldown(60);
                toast.success('OTP sent');
            }
        } catch {
            toast.error('Failed to send OTP');
        } finally {
            setSendingOtp(false);
        }
    };

    // Handle verify OTP
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }
        try {
            setVerifyingOtp(true);
            const response = await verifyEmail({ otp });
            if (response.data.success) {
                toast.success('Email verified');
                setShowOtpModal(false);
                setOtp('');
                setOtpSent(false);
                await fetchProfile();
            }
        } catch {
            toast.error('Invalid OTP');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleCloseOtpModal = () => {
        setShowOtpModal(false);
        setOtp('');
        setOtpSent(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                <Loader className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Avatar with upload */}
                            <div className="relative group">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center overflow-hidden">
                                    {formData.profilePhoto ? (
                                        <img
                                            src={formData.profilePhoto}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">
                                            {formData.firstName?.[0]}{formData.lastName?.[0]}
                                        </span>
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-white dark:bg-neutral-700 rounded-full p-1.5 shadow-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors">
                                        {uploadingPhoto ? (
                                            <Loader className="w-3 h-3 animate-spin text-neutral-600 dark:text-neutral-400" />
                                        ) : (
                                            <Camera className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            disabled={uploadingPhoto}
                                        />
                                    </label>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {formData.firstName} {formData.lastName}
                                </h1>
                                <div className="flex items-center mt-1 space-x-2 flex-wrap gap-2">
                                    <Mail className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{formData.email}</span>
                                    {formData.isEmailVerified ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Verified
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => setShowOtpModal(true)}
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 transition-colors"
                                        >
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            Verify Email
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

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
                                    className="inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                                >
                                    {saving ? (
                                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                            <div className="flex items-center mb-4 pb-2 border-b-2 border-green-200 dark:border-green-800">
                                <User className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Personal Information</h2>
                            </div>
                            {!isEditing ? (
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <User className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">First Name</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.firstName || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <User className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Last Name</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.lastName || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Phone</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.mobile || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Date of Birth</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.dob || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <User className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Gender</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.gender || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Address</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.address || 'Not specified'}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <User className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">First Name</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <User className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Last Name</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Phone</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Date of Birth</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <User className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Gender</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Address</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows="2"
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Enter address"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                            <div className="flex items-center mb-4 pb-2 border-b-2 border-green-200 dark:border-green-800">
                                <Users className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Emergency Contact</h2>
                            </div>
                            {!isEditing ? (
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <User className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Contact Name</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.emergencyContact?.name || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <Users className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Relation</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.emergencyContact?.relation || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Phone</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.emergencyContact?.phone || 'Not specified'}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <User className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Contact Name</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <input
                                                type="text"
                                                name="emergencyContact.name"
                                                value={formData.emergencyContact?.name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Enter contact name"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <Users className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Relation</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <input
                                                type="text"
                                                name="emergencyContact.relation"
                                                value={formData.emergencyContact?.relation}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Enter relation"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Phone</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <input
                                                type="tel"
                                                name="emergencyContact.phone"
                                                value={formData.emergencyContact?.phone}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Security */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                            <div className="flex items-center mb-4 pb-2 border-b-2 border-green-200 dark:border-green-800">
                                <Lock className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Security</h2>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Lock className="w-4 h-4 text-neutral-400 mr-2" />
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Password</span>
                                    <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-500">••••••••</span>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 font-medium"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Medical Information */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                            <div className="flex items-center mb-4 pb-2 border-b-2 border-green-200 dark:border-green-800">
                                <Heart className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Medical Information</h2>
                            </div>
                            {!isEditing ? (
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <Droplet className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Blood Group</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.bloodGroup || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <Ruler className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Height</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.height ? `${formData.height} cm` : 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <Weight className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Weight</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.weight ? `${formData.weight} kg` : 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <AlertCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Allergies</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">{formData.allergies || 'None'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-1 sm:mb-0">
                                            <Pill className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Current Medications</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <span className="text-sm text-neutral-900 dark:text-white">
                                                {formData.currentMedications?.map(m => `${m.name} (${m.dosage})`).join(', ') || 'None'}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <Droplet className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Blood Group</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <select
                                                name="bloodGroup"
                                                value={formData.bloodGroup}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                            >
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <Ruler className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Height (cm)</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <input
                                                type="number"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Enter height in cm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <Weight className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Weight (kg)</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Enter weight in kg"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                        <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                                            <AlertCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Allergies</span>
                                        </div>
                                        <div className="sm:w-2/3">
                                            <textarea
                                                name="allergies"
                                                value={formData.allergies}
                                                onChange={handleChange}
                                                rows="2"
                                                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                placeholder="Separate allergies with commas, e.g., Penicillin, Pollen, Peanuts"
                                            />
                                        </div>
                                    </div>

                                    {/* Current Medications */}
                                    <div className="py-3">
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Current Medications</label>
                                        {formData.currentMedications?.map((med, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    placeholder="Medication name"
                                                    value={med.name || ''}
                                                    onChange={(e) => handleMedicationChange(idx, 'name', e.target.value)}
                                                    className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Dosage"
                                                    value={med.dosage || ''}
                                                    onChange={(e) => handleMedicationChange(idx, 'dosage', e.target.value)}
                                                    className="w-28 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedication(idx)}
                                                    className="px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addMedication}
                                            className="text-sm text-green-600 hover:text-green-700 font-medium mt-2"
                                        >
                                            + Add Medication
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Health Summary Card */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl shadow-sm border border-green-100 dark:border-green-800 p-6">
                            <div className="flex items-center mb-3">
                                <Activity className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                                <h3 className="font-semibold text-neutral-900 dark:text-white">Health Summary</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">BMI</span>
                                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                        {formData.height && formData.weight ?
                                            (formData.weight / ((formData.height / 100) ** 2)).toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Email Status</span>
                                    <span className={`text-sm font-medium ${formData.isEmailVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                        {formData.isEmailVerified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                    placeholder="Enter new password (min 6 characters)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                disabled={changingPassword}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                            >
                                {changingPassword ? (
                                    <>
                                        <Loader className="w-4 h-4 mr-2 inline animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Verify Email Address</h3>
                            <button
                                onClick={handleCloseOtpModal}
                                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            We'll send a verification code to <strong className="text-neutral-900 dark:text-white">{formData.email}</strong>
                        </p>

                        {!otpSent ? (
                            <button
                                onClick={handleSendOtp}
                                disabled={sendingOtp}
                                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                            >
                                {sendingOtp ? (
                                    <>
                                        <Loader className="w-4 h-4 mr-2 inline animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Verification Code"
                                )}
                            </button>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-3 py-2 text-center text-2xl tracking-wider border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={handleSendOtp}
                                        disabled={resendCooldown > 0}
                                        className="text-sm text-green-600 hover:text-green-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
                                    >
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                                    </button>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCloseOtpModal}
                                        className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={verifyingOtp}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                                    >
                                        {verifyingOtp ? (
                                            <>
                                                <Loader className="w-4 h-4 mr-2 inline animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            "Verify Email"
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}