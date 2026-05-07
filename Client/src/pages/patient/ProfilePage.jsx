import React, { useState, useEffect, useCallback, useRef } from 'react';
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

    // Handle input changes - FIXED: removed useCallback to prevent focus issues
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value,
                    },
                };
            }
            return {
                ...prev,
                [name]: value,
            };
        });

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

    // Handle save - FIXED: proper data structure
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

            updateData.append(
                'allergies',
                JSON.stringify(
                    formData.allergies
                        ? formData.allergies.split(',').map(a => a.trim())
                        : []
                )
            );

            updateData.append(
                'currentMedications',
                JSON.stringify(formData.currentMedications || [])
            );

            updateData.append(
                'emergencyContact',
                JSON.stringify(formData.emergencyContact || {})
            );

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

    // Close OTP modal and reset state
    const handleCloseOtpModal = () => {
        setShowOtpModal(false);
        setOtp('');
        setOtpSent(false);
    };

    // Info Row Component
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

    // Editable Field Component - FIXED: memoized to prevent re-renders
    const EditableField = React.memo(({ label, name, value, type = 'text', icon: Icon, required, rows, options, placeholder }) => {
        const isTextarea = type === 'textarea';
        const isSelect = type === 'select';

        return (
            <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                    <Icon className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
                    {required && <span className="text-red-500 ml-1">*</span>}
                </div>
                <div className="sm:w-2/3">
                    {isSelect ? (
                        <select
                            name={name}
                            value={value || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Select {label}</option>
                            {options?.map(opt => (
                                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>
                    ) : isTextarea ? (
                        <textarea
                            name={name}
                            value={value || ''}
                            onChange={handleChange}
                            rows={rows || 3}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                        />
                    ) : (
                        <input
                            type={type}
                            name={name}
                            value={value || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                        />
                    )}
                    {errors[name] && (
                        <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
                    )}
                </div>
            </div>
        );
    });

    const SectionHeader = ({ title, icon: Icon }) => (
        <div className="flex items-center mb-4 pb-2 border-b-2 border-green-200 dark:border-green-800">
            <Icon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
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

                                {/* Upload Button */}
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                                        {uploadingPhoto ? (
                                            <Loader className="w-3 h-3 animate-spin text-gray-600" />
                                        ) : (
                                            <Camera className="w-3 h-3 text-gray-600" />
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
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formData.firstName} {formData.lastName}
                                </h1>
                                <div className="flex items-center mt-1 space-x-2">
                                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{formData.email}</span>
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
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <SectionHeader title="Personal Information" icon={User} />
                            {!isEditing ? (
                                <>
                                    <InfoRow label="First Name" value={formData.firstName} icon={User} />
                                    <InfoRow label="Last Name" value={formData.lastName} icon={User} />
                                    <InfoRow label="Phone" value={formData.mobile} icon={Phone} />
                                    <InfoRow label="Date of Birth" value={formData.dob} icon={Calendar} />
                                    <InfoRow label="Gender" value={formData.gender} icon={User} />
                                    <InfoRow label="Address" value={formData.address} icon={MapPin} />
                                </>
                            ) : (
                                <>
                                    <EditableField label="First Name" name="firstName" value={formData.firstName} icon={User} required />
                                    <EditableField label="Last Name" name="lastName" value={formData.lastName} icon={User} required />
                                    <EditableField label="Phone" name="mobile" value={formData.mobile} type="tel" icon={Phone} />
                                    <EditableField label="Date of Birth" name="dob" value={formData.dob} type="date" icon={Calendar} />
                                    <EditableField label="Gender" name="gender" value={formData.gender} type="select" icon={User} options={["male", "female", "other"]} />
                                    <EditableField label="Address" name="address" value={formData.address} type="textarea" rows={2} icon={MapPin} />
                                </>
                            )}
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <SectionHeader title="Emergency Contact" icon={Users} />
                            {!isEditing ? (
                                <>
                                    <InfoRow label="Contact Name" value={formData.emergencyContact?.name} icon={User} />
                                    <InfoRow label="Relation" value={formData.emergencyContact?.relation} icon={Users} />
                                    <InfoRow label="Phone" value={formData.emergencyContact?.phone} icon={Phone} />
                                </>
                            ) : (
                                <>
                                    <EditableField label="Contact Name" name="emergencyContact.name" value={formData.emergencyContact?.name} icon={User} />
                                    <EditableField label="Relation" name="emergencyContact.relation" value={formData.emergencyContact?.relation} icon={Users} />
                                    <EditableField label="Phone" name="emergencyContact.phone" value={formData.emergencyContact?.phone} type="tel" icon={Phone} />
                                </>
                            )}
                        </div>

                        {/* Security */}
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <SectionHeader title="Medical Information" icon={Heart} />
                            {!isEditing ? (
                                <>
                                    <InfoRow label="Blood Group" value={formData.bloodGroup} icon={Droplet} />
                                    <InfoRow label="Height" value={formData.height ? `${formData.height} cm` : null} icon={Ruler} />
                                    <InfoRow label="Weight" value={formData.weight ? `${formData.weight} kg` : null} icon={Weight} />
                                    <InfoRow label="Allergies" value={formData.allergies || 'None'} icon={AlertCircle} />
                                    <InfoRow label="Current Medications" value={formData.currentMedications?.map(m => `${m.name} (${m.dosage})`).join(', ') || 'None'} icon={Pill} />
                                </>
                            ) : (
                                <>
                                    <EditableField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} icon={Droplet} />
                                    <EditableField label="Height (cm)" name="height" value={formData.height} type="number" icon={Ruler} />
                                    <EditableField label="Weight (kg)" name="weight" value={formData.weight} type="number" icon={Weight} />
                                    <EditableField
                                        label="Allergies"
                                        name="allergies"
                                        value={formData.allergies}
                                        type="textarea"
                                        rows={2}
                                        icon={AlertCircle}
                                        placeholder="Separate allergies with commas, e.g., Penicillin, Pollen, Peanuts"
                                    />

                                    {/* Current Medications */}
                                    <div className="py-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Medications</label>
                                        {formData.currentMedications?.map((med, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    placeholder="Medication name"
                                                    value={med.name || ''}
                                                    onChange={(e) => handleMedicationChange(idx, 'name', e.target.value)}
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Dosage"
                                                    value={med.dosage || ''}
                                                    onChange={(e) => handleMedicationChange(idx, 'dosage', e.target.value)}
                                                    className="w-28 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                <h3 className="font-semibold text-gray-900 dark:text-white">Health Summary</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">BMI</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formData.height && formData.weight ?
                                            (formData.weight / ((formData.height / 100) ** 2)).toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Email Status</span>
                                    <span className={`text-sm font-medium ${formData.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter new password (min 6 characters)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Verify Email Address</h3>
                            <button
                                onClick={handleCloseOtpModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            We'll send a verification code to <strong>{formData.email}</strong>
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-3 py-2 text-center text-2xl tracking-wider border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={handleSendOtp}
                                        disabled={resendCooldown > 0}
                                        className="text-sm text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                                    </button>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCloseOtpModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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