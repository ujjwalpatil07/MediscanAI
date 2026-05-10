import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Plus, Trash2, Send, Loader, Stethoscope, User, Calendar, Clock } from "lucide-react";

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm";

const emptyMedicine = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
  quantity: "",
  refills: 0,
};

export default function PrescriptionModal({ isOpen, onClose, appointment, onSubmit }) {
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens with new appointment
  useEffect(() => {
    if (isOpen) {
      setMedicines([{ ...emptyMedicine }]);
      setNotes("");
      setErrors({});
    }
  }, [isOpen, appointment?._id]);

  const addMedicine = () => {
    setMedicines((prev) => [...prev, { ...emptyMedicine }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index, field, value) => {
    setMedicines((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [`med_${index}_${field}`]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    medicines.forEach((med, index) => {
      if (!med.name?.trim()) {
        newErrors[`med_${index}_name`] = "Medicine name is required";
        isValid = false;
      }
      if (!med.dosage?.trim()) {
        newErrors[`med_${index}_dosage`] = "Dosage is required";
        isValid = false;
      }
      if (!med.frequency?.trim()) {
        newErrors[`med_${index}_frequency`] = "Frequency is required";
        isValid = false;
      }
      if (!med.duration?.trim()) {
        newErrors[`med_${index}_duration`] = "Duration is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        appointmentId: appointment?._id,
        patientId: appointment?.patient?._id,
        medicines: medicines.filter((med) => med.name?.trim()),
        notes,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create prescription:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatTime = (d) => {
    if (!d) return "N/A";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "N/A";
    const h = date.getHours() % 12 || 12;
    const m = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${h}:${m} ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Prescription</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details below</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Patient & Appointment Info */}
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 border-b border-gray-100 dark:border-neutral-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Patient:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {appointment?.patient?.firstName} {appointment?.patient?.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
              <span className="font-medium text-gray-900 dark:text-white">You</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatDate(appointment?.appointmentDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatTime(appointment?.appointmentTime)}</span>
            </div>
          </div>
        </div>

        {/* Medicines Section */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medicines</h3>
            <button
              onClick={addMedicine}
              className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </button>
          </div>

          <div className="space-y-6">
            {medicines.map((medicine, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-neutral-700 rounded-lg relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Medicine #{index + 1}
                  </span>
                  {medicines.length > 1 && (
                    <button
                      onClick={() => removeMedicine(index)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Medicine Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, "name", e.target.value)}
                      placeholder="e.g., Paracetamol"
                      className={`${inputClass} ${errors[`med_${index}_name`] ? "border-red-500" : ""}`}
                    />
                    {errors[`med_${index}_name`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`med_${index}_name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dosage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                      placeholder="e.g., 500mg"
                      className={`${inputClass} ${errors[`med_${index}_dosage`] ? "border-red-500" : ""}`}
                    />
                    {errors[`med_${index}_dosage`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`med_${index}_dosage`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frequency <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={medicine.frequency}
                      onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                      className={`${inputClass} ${errors[`med_${index}_frequency`] ? "border-red-500" : ""}`}
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="At bedtime">At bedtime</option>
                      <option value="As needed">As needed</option>
                      <option value="Every 4 hours">Every 4 hours</option>
                      <option value="Every 6 hours">Every 6 hours</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                      <option value="Once weekly">Once weekly</option>
                    </select>
                    {errors[`med_${index}_frequency`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`med_${index}_frequency`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                      placeholder="e.g., 7 days"
                      className={`${inputClass} ${errors[`med_${index}_duration`] ? "border-red-500" : ""}`}
                    />
                    {errors[`med_${index}_duration`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`med_${index}_duration`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="text"
                      value={medicine.quantity}
                      onChange={(e) => updateMedicine(index, "quantity", e.target.value)}
                      placeholder="e.g., 14 tablets"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Refills
                    </label>
                    <input
                      type="number"
                      value={medicine.refills}
                      onChange={(e) => updateMedicine(index, "refills", parseInt(e.target.value) || 0)}
                      min="0"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Instructions
                    </label>
                    <input
                      type="text"
                      value={medicine.instructions}
                      onChange={(e) => updateMedicine(index, "instructions", e.target.value)}
                      placeholder="e.g., Take after meals"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Doctor's Notes / Diagnosis
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any additional notes or diagnosis..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Create Prescription
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

PrescriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointment: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};