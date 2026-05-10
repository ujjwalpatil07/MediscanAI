import React from 'react';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    loading = false,
    appointmentType
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 dark:bg-black/70"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-[10000] bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-lg mx-4 transition">

                {/* Content */}
                <div className="px-6 pt-5 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {title}
                    </h3>

                    <div className="text-gray-600 dark:text-gray-300">
                        {children}
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-3 flex flex-col sm:flex-row-reverse gap-3 rounded-b-lg">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center justify-center transition"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Booking...
                            </>
                        ) : (
                            (appointmentType === "video" ? "Proceed to Pay" : "Confirm Booking")
                        )}
                    </button>

                    

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}