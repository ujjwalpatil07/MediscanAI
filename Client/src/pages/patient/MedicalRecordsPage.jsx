import React, { useState, useEffect } from 'react';
import {
    Upload,
    FileText,
    Image as ImageIcon,
    Download,
    Trash2,
    Eye,
    Calendar,
    FolderOpen,
    X,
    CheckCircle,
    AlertCircle,
    Loader2,
    User,
    Building2,
    FileEdit,
    Stethoscope,
    Hospital,
    FileText as FileDescription,
    Info
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { deleteMedicalRecord, getMyMedicalRecords, updateMedicalRecord, uploadMedicalRecord } from '../../services/medicalRecord.service';
import toast from 'react-hot-toast';
import MedicalBackground from '../../components/common/MedicalBackground';

export default function MedicalRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(null);
    const [showEditModal, setShowEditModal] = useState(null);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        category: 'Lab Report',
        date: new Date().toISOString().split('T')[0],
        description: '',
        doctorName: '',
        hospitalName: '',
        file: null
    });
    const [uploadError, setUploadError] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        pages: 0,
        limit: 12
    });

    // Load records from API
    useEffect(() => {
        fetchRecords();
    }, [filterCategory, searchTerm, pagination.page]);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const response = await getMyMedicalRecords({
                category: filterCategory,
                search: searchTerm,
                page: pagination.page,
                limit: pagination.limit
            });

            const data = response.data;

            if (data.success) {
                setRecords(data.data);
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination.total,
                    pages: data.pagination.pages
                }));
            }
        } catch (error) {
            console.error("Error fetching records:", error);
            toast.error("Failed to load medical records");
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please upload only PDF or Image files (JPEG, PNG)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setUploadError('File size must be less than 10MB');
            return;
        }

        setUploadError('');
        setUploadForm({ ...uploadForm, file });
    };

    // Handle upload form change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUploadForm({ ...uploadForm, [name]: value });
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!uploadForm.title) {
            setUploadError('Please enter a report title');
            return;
        }
        if (!uploadForm.file) {
            setUploadError('Please select a file to upload');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('title', uploadForm.title);
        formData.append('category', uploadForm.category);
        formData.append('date', uploadForm.date);
        formData.append('description', uploadForm.description);
        formData.append('doctorName', uploadForm.doctorName);
        formData.append('hospitalName', uploadForm.hospitalName);
        formData.append('file', uploadForm.file);

        try {
            const response = await uploadMedicalRecord(formData);

            const data = response.data;

            if (data.success) {
                toast.success('Medical record uploaded successfully');
                setShowUploadModal(false);
                setUploadForm({
                    title: '',
                    category: 'Lab Report',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    doctorName: '',
                    hospitalName: '',
                    file: null
                });
                fetchRecords();
            }
        } catch (error) {
            console.error("Error uploading record:", error);
            toast.error(error.response?.data?.message || "Failed to upload medical record");
        } finally {
            setUploading(false);
        }
    };

    // Handle delete record
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medical record? This action cannot be undone.')) {
            try {
                const response = await deleteMedicalRecord(id);

                const data = response.data;

                if (data.success) {
                    toast.success('Medical record deleted successfully');
                    fetchRecords();
                    if (showPreviewModal) setShowPreviewModal(null);
                }
            } catch (error) {
                console.error("Error deleting record:", error);
                toast.error("Failed to delete medical record");
            }
        }
    };

    // Handle download record
    const handleDownload = (record) => {
        const link = document.createElement('a');
        link.href = record.fileUrl;
        link.download = record.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started');
    };

    // Handle view record
    const handleView = (record) => {
        setShowPreviewModal(record);
    };

    // Handle edit record
    const handleEdit = (record) => {
        setShowEditModal(record);
    };

    // Handle update record
    const handleUpdate = async () => {
        if (!showEditModal.title) {
            toast.error('Please enter a title');
            return;
        }

        try {
            const response = await updateMedicalRecord(showEditModal._id, {
                title: showEditModal.title,
                category: showEditModal.category,
                date: showEditModal.date,
                description: showEditModal.description,
                doctorName: showEditModal.doctorName,
                hospitalName: showEditModal.hospitalName
            });

            const data = response.data;

            if (data.success) {
                toast.success('Medical record updated successfully');
                setShowEditModal(null);
                fetchRecords();
            }
        } catch (error) {
            console.error("Error updating record:", error);
            toast.error("Failed to update medical record");
        }
    };

    // Get file icon based on type
    const getFileIcon = (fileType) => {
        return fileType === 'pdf' ? FileText : ImageIcon;
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            'Lab Report': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'Scan': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            'Prescription': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'Vaccination': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'Other': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
        };
        return colors[category] || colors['Other'];
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-500"></div>
                    <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading medical records...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <MedicalBackground/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center">
                                <FolderOpen className="w-8 h-8 text-green-600 dark:text-green-500 mr-3" />
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Medical Records</h1>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                                Upload and manage your health reports, lab results, and scan images
                            </p>
                        </div>

                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-all shadow-md"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Report
                        </button>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by title or file name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        />
                    </div>
                    <div className="sm:w-64">
                        <select
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-green-500 transition"
                        >
                            <option value="all">All Categories</option>
                            <option value="Lab Report">Lab Reports</option>
                            <option value="Scan">Scans & Imaging</option>
                            <option value="Prescription">Prescriptions</option>
                            <option value="Vaccination">Vaccinations</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Empty State */}
                {records.length === 0 && !searchTerm && filterCategory === 'all' && (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                        <FolderOpen className="w-20 h-20 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No Medical Records</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
                            You haven't uploaded any medical records yet. Upload your lab reports, scan images, and other health documents to keep them organized.
                        </p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-all"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Your First Report
                        </button>
                    </div>
                )}

                {/* Search No Results */}
                {records.length === 0 && (searchTerm || filterCategory !== 'all') && (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No Matching Records</h3>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            {searchTerm ? `No records found matching "${searchTerm}"` : `No records in ${filterCategory} category`}
                        </p>
                    </div>
                )}

                {/* Records Grid */}
                {records.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {records.map((record) => {
                                const FileIcon = getFileIcon(record.fileType);
                                const categoryColor = getCategoryColor(record.category);

                                return (
                                    <div
                                        key={record._id}
                                        className="group bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 overflow-hidden"
                                    >
                                        {/* File Preview Area */}
                                        <div className="relative h-40 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center">
                                            {record.fileType === 'image' ? (
                                                <img
                                                    src={record.fileUrl}
                                                    alt={record.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <FileIcon className="w-12 h-12 text-green-600 dark:text-green-500 mx-auto mb-2" />
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">PDF Document</p>
                                                </div>
                                            )}

                                            {/* Category Badge */}
                                            <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${categoryColor}`}>
                                                {record.category}
                                            </div>

                                            {/* File Type Badge */}
                                            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 backdrop-blur-sm">
                                                {record.fileType === 'pdf' ? 'PDF' : 'Image'}
                                            </div>
                                        </div>

                                        {/* Record Details */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
                                                {record.title}
                                            </h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                                                {record.fileName}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(record.date)}
                                                </div>
                                                <div>
                                                    {formatFileSize(record.fileSize)}
                                                </div>
                                            </div>

                                            {/* Doctor and Hospital Info */}
                                            {(record.doctorName || record.hospitalName) && (
                                                <div className="space-y-1 mb-3">
                                                    {record.doctorName && (
                                                        <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400">
                                                            <Stethoscope className="w-3 h-3 mr-1" />
                                                            <span className="truncate">{record.doctorName}</span>
                                                        </div>
                                                    )}
                                                    {record.hospitalName && (
                                                        <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400">
                                                            <Building2 className="w-3 h-3 mr-1" />
                                                            <span className="truncate">{record.hospitalName}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Description Preview */}
                                            {record.description && (
                                                <div className="mb-3">
                                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                                        {record.description}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
                                                <button
                                                    onClick={() => handleView(record)}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(record)}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                >
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Download
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm text-yellow-600 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                                                >
                                                    <FileEdit className="w-4 h-4 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record._id)}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-neutral-700 dark:text-neutral-300">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Stats Footer */}
                        <div className="mt-8 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center justify-between text-sm">
                                <div className="text-neutral-600 dark:text-neutral-400">
                                    Total Records: <span className="font-semibold text-neutral-900 dark:text-white">{pagination.total}</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-neutral-600 dark:text-neutral-400">
                                        Lab Reports: <span className="font-semibold text-blue-600 dark:text-blue-400">
                                            {records.filter(r => r.category === 'Lab Report').length}
                                        </span>
                                    </div>
                                    <div className="text-neutral-600 dark:text-neutral-400">
                                        Scans: <span className="font-semibold text-purple-600 dark:text-purple-400">
                                            {records.filter(r => r.category === 'Scan').length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full my-8">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center">
                                <Upload className="w-5 h-5 text-green-600 dark:text-green-500 mr-2" />
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Upload Medical Record</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setUploadError('');
                                    setUploadForm({
                                        title: '',
                                        category: 'Lab Report',
                                        date: new Date().toISOString().split('T')[0],
                                        description: '',
                                        doctorName: '',
                                        hospitalName: '',
                                        file: null
                                    });
                                }}
                                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Report Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={uploadForm.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Blood Test Report - Feb 2026"
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={uploadForm.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                >
                                    <option value="Lab Report">Lab Report</option>
                                    <option value="Scan">Scan / Imaging</option>
                                    <option value="Prescription">Prescription</option>
                                    <option value="Vaccination">Vaccination</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Report Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={uploadForm.date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                />
                            </div>

                            {/* Doctor Name */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Doctor Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="doctorName"
                                    value={uploadForm.doctorName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Dr. John Smith"
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                />
                            </div>

                            {/* Hospital Name */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Hospital/Clinic Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="hospitalName"
                                    value={uploadForm.hospitalName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., City Hospital"
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={uploadForm.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Additional notes about this medical record..."
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition resize-none"
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    File * (PDF or Image, max 10MB)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-200 dark:border-neutral-700 border-dashed rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-colors">
                                    <div className="space-y-1 text-center">
                                        {uploadForm.file ? (
                                            <>
                                                <CheckCircle className="mx-auto h-12 w-12 text-green-600 dark:text-green-500" />
                                                <div className="text-sm text-neutral-900 dark:text-white">
                                                    {uploadForm.file.name}
                                                </div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB
                                                </div>
                                                <button
                                                    onClick={() => setUploadForm({ ...uploadForm, file: null })}
                                                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Remove
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500" />
                                                <div className="flex text-sm text-neutral-600 dark:text-neutral-400">
                                                    <label className="relative cursor-pointer bg-white dark:bg-neutral-800 rounded-md font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400 focus-within:outline-none">
                                                        <span>Upload a file</span>
                                                        <input
                                                            type="file"
                                                            className="sr-only"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={handleFileSelect}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    PDF, PNG, JPG up to 10MB
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {uploadError && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setUploadError('');
                                    setUploadForm({
                                        title: '',
                                        category: 'Lab Report',
                                        date: new Date().toISOString().split('T')[0],
                                        description: '',
                                        doctorName: '',
                                        hospitalName: '',
                                        file: null
                                    });
                                }}
                                className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload Report'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPreviewModal && (
                <div className="fixed inset-0 bg-black/75 dark:bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                            <div>
                                <h3 className="font-semibold text-neutral-900 dark:text-white">{showPreviewModal.title}</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{showPreviewModal.fileName}</p>
                            </div>
                            <button
                                onClick={() => setShowPreviewModal(null)}
                                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* File Preview */}
                        <div className="flex-1 overflow-auto p-4 bg-neutral-100 dark:bg-neutral-900">
                            {showPreviewModal.fileType === 'image' ? (
                                <img
                                    src={showPreviewModal.fileUrl}
                                    alt={showPreviewModal.title}
                                    className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                                />
                            ) : (
                                <iframe
                                    src={showPreviewModal.fileUrl}
                                    title={showPreviewModal.title}
                                    className="w-full h-full min-h-[500px] rounded-lg"
                                />
                            )}
                        </div>

                        {/* Record Details Section */}
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* Left Column */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Category</label>
                                        <p className="text-sm text-neutral-900 dark:text-white mt-1">{showPreviewModal.category}</p>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Report Date</label>
                                        <p className="text-sm text-neutral-900 dark:text-white mt-1">{formatDate(showPreviewModal.date)}</p>
                                    </div>

                                    {showPreviewModal.doctorName && (
                                        <div>
                                            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Doctor Name</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Stethoscope className="w-4 h-4 text-green-600 dark:text-green-500" />
                                                <p className="text-sm text-neutral-900 dark:text-white">{showPreviewModal.doctorName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">File Info</label>
                                        <p className="text-sm text-neutral-900 dark:text-white mt-1">{showPreviewModal.fileName}</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatFileSize(showPreviewModal.fileSize)}</p>
                                    </div>

                                    {showPreviewModal.hospitalName && (
                                        <div>
                                            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Hospital/Clinic</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Hospital className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                                                <p className="text-sm text-neutral-900 dark:text-white">{showPreviewModal.hospitalName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {showPreviewModal.description && (
                                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase flex items-center gap-2">
                                        <FileDescription className="w-4 h-4" />
                                        Description
                                    </label>
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2 whitespace-pre-wrap">
                                        {showPreviewModal.description}
                                    </p>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        Uploaded: {formatDate(showPreviewModal.createdAt)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Info className="w-3 h-3" />
                                        ID: {showPreviewModal._id.slice(-8)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 rounded-b-xl">
                            <button
                                onClick={() => handleDownload(showPreviewModal)}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </button>
                            <button
                                onClick={() => {
                                    handleEdit(showPreviewModal);
                                    setShowPreviewModal(null);
                                }}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-yellow-600 dark:bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-700 transition-colors"
                            >
                                <FileEdit className="w-4 h-4 mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(showPreviewModal._id);
                                    setShowPreviewModal(null);
                                }}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center">
                                <FileEdit className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mr-2" />
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Edit Medical Record</h2>
                            </div>
                            <button
                                onClick={() => setShowEditModal(null)}
                                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Report Title *
                                </label>
                                <input
                                    type="text"
                                    value={showEditModal.title || ''}
                                    onChange={(e) => setShowEditModal({ ...showEditModal, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Category *
                                </label>
                                <select
                                    value={showEditModal.category || 'Lab Report'}
                                    onChange={(e) => setShowEditModal({ ...showEditModal, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                >
                                    <option value="Lab Report">Lab Report</option>
                                    <option value="Scan">Scan / Imaging</option>
                                    <option value="Prescription">Prescription</option>
                                    <option value="Vaccination">Vaccination</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Report Date *
                                </label>
                                <input
                                    type="date"
                                    value={showEditModal.date ? new Date(showEditModal.date).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setShowEditModal({ ...showEditModal, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Doctor Name
                                </label>
                                <input
                                    type="text"
                                    value={showEditModal.doctorName || ''}
                                    onChange={(e) => setShowEditModal({ ...showEditModal, doctorName: e.target.value })}
                                    placeholder="e.g., Dr. John Smith"
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Hospital/Clinic Name
                                </label>
                                <input
                                    type="text"
                                    value={showEditModal.hospitalName || ''}
                                    onChange={(e) => setShowEditModal({ ...showEditModal, hospitalName: e.target.value })}
                                    placeholder="e.g., City Hospital"
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={showEditModal.description || ''}
                                    onChange={(e) => setShowEditModal({ ...showEditModal, description: e.target.value })}
                                    rows="3"
                                    placeholder="Additional notes about this medical record..."
                                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                            <button
                                onClick={() => setShowEditModal(null)}
                                className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="flex-1 px-4 py-2 bg-yellow-600 dark:bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}