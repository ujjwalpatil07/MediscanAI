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
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export default function MedicalRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(null);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        category: 'Lab Report',
        date: new Date().toISOString().split('T')[0],
        file: null
    });
    const [uploadError, setUploadError] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Load records from localStorage on mount
    useEffect(() => {
        const savedRecords = localStorage.getItem('medicalRecords');
        if (savedRecords) {
            setRecords(JSON.parse(savedRecords));
        }
        setLoading(false);
    }, []);

    // Save records to localStorage whenever they change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('medicalRecords', JSON.stringify(records));
        }
    }, [records, loading]);

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

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create file preview URL
        const fileURL = URL.createObjectURL(uploadForm.file);
        const fileType = uploadForm.file.type;
        const fileExtension = fileType === 'application/pdf' ? 'pdf' : 'image';

        const newRecord = {
            id: Date.now(),
            title: uploadForm.title,
            category: uploadForm.category,
            date: uploadForm.date,
            fileName: uploadForm.file.name,
            fileSize: uploadForm.file.size,
            fileType: fileExtension,
            fileMimeType: fileType,
            fileURL: fileURL,
            uploadDate: new Date().toISOString()
        };

        setRecords(prev => [newRecord, ...prev]);
        setUploadForm({
            title: '',
            category: 'Lab Report',
            date: new Date().toISOString().split('T')[0],
            file: null
        });
        setShowUploadModal(false);
        setUploading(false);
        setUploadError('');
    };

    // Handle delete record
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this medical record? This action cannot be undone.')) {
            const recordToDelete = records.find(r => r.id === id);
            if (recordToDelete?.fileURL) {
                URL.revokeObjectURL(recordToDelete.fileURL);
            }
            setRecords(prev => prev.filter(record => record.id !== id));
        }
    };

    // Handle download record
    const handleDownload = (record) => {
        const link = document.createElement('a');
        link.href = record.fileURL;
        link.download = record.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle view record
    const handleView = (record) => {
        setShowPreviewModal(record);
    };

    // Get file icon based on type
    const getFileIcon = (fileType) => {
        return fileType === 'pdf' ? FileText : ImageIcon;
    };

    // Get category color
    const getCategoryColor = (category) => {
        return category === 'Lab Report'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Filter records
    const filteredRecords = records.filter(record => {
        const matchesCategory = filterCategory === 'all' || record.category === filterCategory;
        const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.fileName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-500"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading medical records...</p>
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
                                <FolderOpen className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Records</h1>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Upload and manage your health reports, lab results, and scan images
                            </p>
                        </div>

                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                    <div className="sm:w-64">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Categories</option>
                            <option value="Lab Report">Lab Reports</option>
                            <option value="Scan">Scans & Imaging</option>
                        </select>
                    </div>
                </div>

                {/* Empty State */}
                {filteredRecords.length === 0 && !searchTerm && filterCategory === 'all' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                        <FolderOpen className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Medical Records</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                            You haven't uploaded any medical records yet. Upload your lab reports, scan images, and other health documents to keep them organized.
                        </p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Your First Report
                        </button>
                    </div>
                )}

                {/* Search No Results */}
                {filteredRecords.length === 0 && (searchTerm || filterCategory !== 'all') && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Matching Records</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm ? `No records found matching "${searchTerm}"` : `No records in ${filterCategory} category`}
                        </p>
                    </div>
                )}

                {/* Records Grid */}
                {filteredRecords.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecords.map((record) => {
                            const FileIcon = getFileIcon(record.fileType);
                            const categoryColor = getCategoryColor(record.category);

                            return (
                                <div
                                    key={record.id}
                                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden"
                                >
                                    {/* File Preview Area */}
                                    <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                        {record.fileType === 'image' ? (
                                            <img
                                                src={record.fileURL}
                                                alt={record.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <FileIcon className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document</p>
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${categoryColor}`}>
                                            {record.category}
                                        </div>

                                        {/* File Type Badge */}
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300">
                                            {record.fileType === 'pdf' ? 'PDF' : 'Image'}
                                        </div>
                                    </div>

                                    {/* Record Details */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                            {record.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            {record.fileName}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatDate(record.date)}
                                            </div>
                                            <div>
                                                {formatFileSize(record.fileSize)}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <button
                                                onClick={() => handleView(record)}
                                                className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDownload(record)}
                                                className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Download
                                            </button>
                                            <button
                                                onClick={() => handleDelete(record.id)}
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
                )}

                {/* Stats Footer */}
                {records.length > 0 && (
                    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-600 dark:text-gray-400">
                                Total Records: <span className="font-semibold text-gray-900 dark:text-white">{records.length}</span>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-gray-600 dark:text-gray-400">
                                    Lab Reports: <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        {records.filter(r => r.category === 'Lab Report').length}
                                    </span>
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    Scans: <span className="font-semibold text-purple-600 dark:text-purple-400">
                                        {records.filter(r => r.category === 'Scan').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <Upload className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Medical Record</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setUploadError('');
                                    setUploadForm({
                                        title: '',
                                        category: 'Lab Report',
                                        date: new Date().toISOString().split('T')[0],
                                        file: null
                                    });
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Report Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={uploadForm.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Blood Test Report - Feb 2026"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={uploadForm.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="Lab Report">Lab Report</option>
                                    <option value="Scan">Scan / Imaging</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Report Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={uploadForm.date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    File * (PDF or Image, max 10MB)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-green-500 transition-colors">
                                    <div className="space-y-1 text-center">
                                        {uploadForm.file ? (
                                            <>
                                                <CheckCircle className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" />
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {uploadForm.file.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB
                                                </div>
                                                <button
                                                    onClick={() => setUploadForm({ ...uploadForm, file: null })}
                                                    className="text-xs text-red-600 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
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
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
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

                        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setUploadError('');
                                    setUploadForm({
                                        title: '',
                                        category: 'Lab Report',
                                        date: new Date().toISOString().split('T')[0],
                                        file: null
                                    });
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Preview Modal */}
            {showPreviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{showPreviewModal.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{showPreviewModal.fileName}</p>
                            </div>
                            <button
                                onClick={() => setShowPreviewModal(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-900">
                            {showPreviewModal.fileType === 'image' ? (
                                <img
                                    src={showPreviewModal.fileURL}
                                    alt={showPreviewModal.title}
                                    className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                                />
                            ) : (
                                <iframe
                                    src={showPreviewModal.fileURL}
                                    title={showPreviewModal.title}
                                    className="w-full h-full min-h-[500px] rounded-lg"
                                />
                            )}
                        </div>

                        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => handleDownload(showPreviewModal)}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </button>
                            <button
                                onClick={() => handleDelete(showPreviewModal.id)}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};