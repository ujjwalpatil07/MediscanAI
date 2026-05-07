import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Search, User, MessageCircle } from "lucide-react";
import api from "../../api/api";

/**
 * NewChatModal Component
 * 
 * Shows a list of all patients for the doctor to start a new conversation.
 * 
 * Props:
 * - isOpen: Whether the modal is visible
 * - onClose: Function to close the modal
 * - onSelectPatient: Function called when a patient is selected
 */
export default function NewChatModal({ isOpen, onClose, onSelectPatient }) {
  const [patients, setPatients] = useState([]);       // All patients
  const [searchTerm, setSearchTerm] = useState("");   // Search input
  const [loading, setLoading] = useState(false);      // Loading state

  /**
   * Fetch patients when modal opens
   * We fetch from the doctor's patient list endpoint
   */
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Use the doctor's patients endpoint we already built
      const response = await api.get("/doctor/patients?limit=100");
      setPatients(response.data.data?.patients || []);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter patients based on search term
   */
  const filteredPatients = patients.filter((patient) => {
    if (!searchTerm.trim()) return true;

    const search = searchTerm.toLowerCase();
    const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase();

    return (
      fullName.includes(search) ||
      (patient.email || "").toLowerCase().includes(search) ||
      (patient.mobile || "").includes(search)
    );
  });

  /**
   * Handle selecting a patient
   * We need to format the patient data to match the conversation structure
   */
  const handleSelect = (patient) => {
    // Format the patient data to match what useChat expects
    const conversationData = {
      userId: patient._id,
      user: {
        _id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        mobile: patient.mobile,
        isActive: true, // We'll set this; actual status comes from socket
      },
      lastMessage: null,
      unreadCount: 0,
    };

    onSelectPatient(conversationData);
    onClose();
  };

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            New Message
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-neutral-700">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name, email, or phone..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Patient List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <MessageCircle className="w-8 h-8 text-gray-400 animate-bounce mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading patients...</p>
            </div>
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <button
                key={patient._id}
                onClick={() => handleSelect(patient)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-750 transition border-b border-gray-100 dark:border-neutral-700/50 text-left"
              >
                {/* Patient Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {getInitials(patient.firstName, patient.lastName)}
                  </span>
                </div>

                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {patient.email || patient.mobile || "No contact info"}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12 px-4">
              <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? "No patients match your search" : "No patients found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

NewChatModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectPatient: PropTypes.func.isRequired,
};