import React from 'react';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    loading = false
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

            {/* ✅ Overlay (LOWER z-index) */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* ✅ Modal (HIGHER z-index) */}
            <div className="relative z-[10000] bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">

                {/* Content */}
                <div className="px-6 pt-5 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {title}
                    </h3>

                    <div>
                        {children}
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-6 pb-3 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Booking...
                            </>
                        ) : (
                            "Confirm Booking"
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}