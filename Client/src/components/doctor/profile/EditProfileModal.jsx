import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { X, Save, Plus, Trash2 } from "lucide-react";
import AuthContext from "../../../context/AuthContext";
import { useSnackbar } from "notistack";
import ButtonLoader from "../../common/ButtonLoader";
import api from "../../../api/api";

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm";

const DAYS_OF_WEEK = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

const SPECIALTIES = [
  "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics",
  "Psychiatry", "Radiology", "General Medicine", "Gynecology", "ENT",
  "Ophthalmology", "Dentistry", "Urology", "Oncology", "Endocrinology"
];

const DEGREES = ["MBBS", "MD", "MS", "BDS", "DNB", "DM", "MCh"];

export default function EditProfileModal({ isOpen, onClose }) {
  const { loginUser, setLoginUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [activeSection, setActiveSection] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...loginUser });

  const sections = [
    { id: "personal", label: "Personal Info" },
    { id: "professional", label: "Professional" },
    { id: "clinic", label: "Clinic Info" },
    { id: "availability", label: "Availability" },
    { id: "certifications", label: "Certifications" },
    { id: "memberships", label: "Memberships" },
    { id: "languages", label: "Languages" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleTimingChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      clinicTimings: {
        ...prev.clinicTimings,
        [day]: {
          ...(prev.clinicTimings?.[day] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays?.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...(prev.availableDays || []), day],
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put("/auth/doctor/update-profile", formData);
      setLoginUser(response.data.user);
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
      onClose();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || "Failed to update profile",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Profile
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeSection === section.id
                  ? "border-green-600 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeSection === "personal" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="First Name" name="firstName" value={formData.firstName || ""} onChange={handleChange} />
              <InputField label="Last Name" name="lastName" value={formData.lastName || ""} onChange={handleChange} />
              <InputField label="Email" name="email" type="email" value={formData.email || ""} onChange={handleChange} />
              <InputField label="Phone" name="phone" type="tel" value={formData.phone || ""} onChange={handleChange} />
              <InputField label="Date of Birth" name="dob" type="date" value={formData.dob ? new Date(formData.dob).toISOString().split("T")[0] : ""} onChange={handleChange} />
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Gender</label>
                <select name="gender" value={formData.gender || ""} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <InputField label="Blood Group" name="bloodGroup" value={formData.bloodGroup || ""} onChange={handleChange} />
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Address</label>
                <textarea name="address" value={formData.address || ""} onChange={handleChange} rows={2} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Bio</label>
                <textarea name="bio" value={formData.bio || ""} onChange={handleChange} rows={3} className={inputClass} placeholder="Write a brief bio..." />
              </div>
            </div>
          )}

          {activeSection === "professional" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Specialty</label>
                <select name="specialty" value={formData.specialty || ""} onChange={handleChange} className={inputClass}>
                  <option value="">Select Specialty</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <InputField label="Sub Specialty" name="subSpecialty" value={formData.subSpecialty || ""} onChange={handleChange} />
              <InputField label="License Number" name="licenseNumber" value={formData.licenseNumber || ""} onChange={handleChange} />
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Medical Degree</label>
                <select name="medicalDegree" value={formData.medicalDegree || ""} onChange={handleChange} className={inputClass}>
                  <option value="">Select Degree</option>
                  {DEGREES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <InputField label="University" name="university" value={formData.university || ""} onChange={handleChange} />
              <InputField label="Graduation Year" name="graduationYear" type="number" value={formData.graduationYear || ""} onChange={handleChange} />
              <InputField label="Years of Experience" name="yearsOfExperience" type="number" value={formData.yearsOfExperience || ""} onChange={handleChange} />
              <InputField label="Consultation Fee (₹)" name="consultationFee" type="number" value={formData.consultationFee || ""} onChange={handleChange} />
            </div>
          )}

          {activeSection === "clinic" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField label="Clinic Name" name="clinicName" value={formData.clinicName || ""} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Clinic Address</label>
                <textarea name="clinicAddress" value={formData.clinicAddress || ""} onChange={handleChange} rows={2} className={inputClass} />
              </div>
              <InputField label="City" name="clinicCity" value={formData.clinicCity || ""} onChange={handleChange} />
              <InputField label="State" name="clinicState" value={formData.clinicState || ""} onChange={handleChange} />
              <InputField label="Pincode" name="clinicPincode" value={formData.clinicPincode || ""} onChange={handleChange} />
              <InputField label="Clinic Phone" name="clinicPhone" value={formData.clinicPhone || ""} onChange={handleChange} />
              <InputField label="Clinic Email" name="clinicEmail" type="email" value={formData.clinicEmail || ""} onChange={handleChange} />
              <InputField label="Website" name="clinicWebsite" value={formData.clinicWebsite || ""} onChange={handleChange} />

              <div className="sm:col-span-2 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Clinic Timings</h4>
                <div className="space-y-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="w-24 text-sm capitalize text-gray-700 dark:text-gray-300">{day}</span>
                      <input
                        type="time"
                        value={formData.clinicTimings?.[day]?.start || ""}
                        onChange={(e) => handleTimingChange(day, "start", e.target.value)}
                        className={`${inputClass} w-32`}
                        placeholder="Start"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={formData.clinicTimings?.[day]?.end || ""}
                        onChange={(e) => handleTimingChange(day, "end", e.target.value)}
                        className={`${inputClass} w-32`}
                        placeholder="End"
                      />
                      <label className="flex items-center gap-1 text-xs text-gray-500">
                        <input
                          type="checkbox"
                          checked={!formData.clinicTimings?.[day]?.start}
                          onChange={() => {
                            if (formData.clinicTimings?.[day]?.start) {
                              handleTimingChange(day, "start", "");
                              handleTimingChange(day, "end", "");
                            }
                          }}
                          className="w-3 h-3 text-green-600"
                        />
                        Closed
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "availability" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition capitalize ${formData.availableDays?.includes(day)
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600"
                        }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Start Time</label>
                  <input
                    type="time"
                    value={formData.availableTimeSlots?.start || ""}
                    onChange={(e) => handleNestedChange("availableTimeSlots", "start", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">End Time</label>
                  <input
                    type="time"
                    value={formData.availableTimeSlots?.end || ""}
                    onChange={(e) => handleNestedChange("availableTimeSlots", "end", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "certifications" && (
            <ArraySection
              title="Certifications"
              items={formData.certifications || []}
              onAdd={() => addArrayItem("certifications")}
              onUpdate={(index, value) => updateArrayItem("certifications", index, value)}
              onRemove={(index) => removeArrayItem("certifications", index)}
              placeholder="e.g., American Board of Cardiology"
            />
          )}

          {activeSection === "memberships" && (
            <ArraySection
              title="Memberships"
              items={formData.memberships || []}
              onAdd={() => addArrayItem("memberships")}
              onUpdate={(index, value) => updateArrayItem("memberships", index, value)}
              onRemove={(index) => removeArrayItem("memberships", index)}
              placeholder="e.g., Indian Medical Association (IMA)"
            />
          )}

          {activeSection === "languages" && (
            <ArraySection
              title="Languages"
              items={formData.languages || []}
              onAdd={() => addArrayItem("languages")}
              onUpdate={(index, value) => updateArrayItem("languages", index, value)}
              onRemove={(index) => removeArrayItem("languages", index)}
              placeholder="e.g., English"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <ButtonLoader text="Saving..." /> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

function InputField({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

function ArraySection({ title, items, onAdd, onUpdate, onRemove, placeholder }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-gray-400 italic py-4 text-center">No {title.toLowerCase()} added yet</p>
      )}
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

ArraySection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};