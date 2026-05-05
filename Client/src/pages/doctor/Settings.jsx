import { useState } from "react";
import {
  Bell,
  Lock,
  User,
  Calendar,
  MessageCircle,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Shield,
  Smartphone,
  Mail,
  Clock,
  Users,
  Camera,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const settingsSections = [
  {
    id: "profile",
    label: "Profile Settings",
    icon: User,
    description: "Manage your personal and professional information",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Control how you receive alerts and updates",
  },
  {
    id: "appointments",
    label: "Appointment Settings",
    icon: Calendar,
    description: "Configure appointment preferences and availability",
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: Shield,
    description: "Manage your account security and privacy settings",
  },
  {
    id: "messages",
    label: "Message Settings",
    icon: MessageCircle,
    description: "Set up your messaging preferences",
  },
  {
    id: "patients",
    label: "Patient Management",
    icon: Users,
    description: "Configure patient interaction settings",
  },
];

export default function DoctorSettings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saveStatus, setSaveStatus] = useState(null);

  const [profileSettings, setProfileSettings] = useState({
    firstName: "Stephen",
    lastName: "Conley",
    email: "dr.stephen@mediscanai.com",
    phone: "(704) 555-0127",
    specialty: "Cardiology",
    licenseNumber: "SSBB454D4HDER787",
    experience: "15",
    degree: "MD - Cardiology",
    consultationFee: "500",
    bio: "Experienced cardiologist specializing in interventional cardiology and heart disease management.",
    clinicName: "Conley Heart Care Center",
    clinicAddress: "1st Floor, Lotus Medical Complex, MG Road, Andheri West",
    clinicCity: "Mumbai",
    clinicState: "Maharashtra",
    clinicPincode: "400053",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    newPatientAlerts: true,
    messageAlerts: true,
    paymentAlerts: true,
    reminderTime: "30",
    dailySummary: true,
    weeklyReport: false,
    urgentOnly: false,
  });

  const [appointmentSettings, setAppointmentSettings] = useState({
    autoAccept: false,
    requireConfirmation: true,
    allowRescheduling: true,
    maxPatientsPerDay: "20",
    appointmentDuration: "30",
    bufferTime: "10",
    onlineConsultation: true,
    clinicVisit: true,
    allowEmergency: true,
    advanceBookingDays: "30",
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfileInSearch: true,
    showExperience: true,
    showReviews: true,
    showFees: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,
    dataSharing: false,
  });

  const [messageSettings, setMessageSettings] = useState({
    allowPatientMessages: true,
    autoReply: false,
    autoReplyMessage: "Thank you for your message. I will respond within 24 hours.",
    messageForwarding: false,
    forwardingEmail: "",
    chatAvailability: "always",
    allowAttachments: true,
  });

  const [patientSettings, setPatientSettings] = useState({
    autoSharePrescriptions: true,
    allowPatientNotes: true,
    patientCanUpload: true,
    showVisitHistory: true,
    showLabResults: true,
    allowPatientFeedback: true,
    newPatientApproval: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = (section) => {
    setSaveStatus({ section, status: "saving" });
    setTimeout(() => {
      setSaveStatus({ section, status: "saved" });
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${enabled ? "bg-green-600" : "bg-gray-300 dark:bg-neutral-600"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              SC
            </span>
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-neutral-700 rounded-full shadow-md hover:shadow-lg transition">
            <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile Photo
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload a professional photo. Max size 2MB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={profileSettings.firstName}
            onChange={(e) =>
              setProfileSettings({ ...profileSettings, firstName: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={profileSettings.lastName}
            onChange={(e) =>
              setProfileSettings({ ...profileSettings, lastName: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={profileSettings.email}
            onChange={(e) =>
              setProfileSettings({ ...profileSettings, email: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={profileSettings.phone}
            onChange={(e) =>
              setProfileSettings({ ...profileSettings, phone: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Specialty
          </label>
          <select
            value={profileSettings.specialty}
            onChange={(e) =>
              setProfileSettings({ ...profileSettings, specialty: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          >
            <option>Cardiology</option>
            <option>Dermatology</option>
            <option>Neurology</option>
            <option>Orthopedics</option>
            <option>Pediatrics</option>
            <option>General Medicine</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            License Number
          </label>
          <input
            type="text"
            value={profileSettings.licenseNumber}
            onChange={(e) =>
              setProfileSettings({ ...profileSettings, licenseNumber: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            value={profileSettings.experience}
            onChange={(e) =>
              setProfileSettings({ ...profileSettings, experience: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Consultation Fee (₹)
          </label>
          <input
            type="number"
            value={profileSettings.consultationFee}
            onChange={(e) =>
              setProfileSettings({ ...profileSettings, consultationFee: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Bio
        </label>
        <textarea
          value={profileSettings.bio}
          onChange={(e) =>
            setProfileSettings({ ...profileSettings, bio: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Clinic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Clinic Name
            </label>
            <input
              type="text"
              value={profileSettings.clinicName}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, clinicName: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              value={profileSettings.clinicAddress}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, clinicAddress: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              value={profileSettings.clinicCity}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, clinicCity: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State
            </label>
            <input
              type="text"
              value={profileSettings.clinicState}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, clinicState: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Change Password
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("profile")}
          disabled={saveStatus?.status === "saving"}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-60"
        >
          {saveStatus?.section === "profile" && saveStatus?.status === "saving" ? (
            "Saving..."
          ) : saveStatus?.section === "profile" && saveStatus?.status === "saved" ? (
            "Saved!"
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Notification Channels
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={notificationSettings.emailNotifications}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  emailNotifications: val,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  SMS Notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive notifications via text message
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={notificationSettings.smsNotifications}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  smsNotifications: val,
                })
              }
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Alert Preferences
        </h4>
        <div className="space-y-4">
          {[
            { key: "appointmentReminders", label: "Appointment Reminders", desc: "Get reminded about upcoming appointments" },
            { key: "newPatientAlerts", label: "New Patient Alerts", desc: "Alert when a new patient books an appointment" },
            { key: "messageAlerts", label: "Message Alerts", desc: "Notifications for new patient messages" },
            { key: "paymentAlerts", label: "Payment Alerts", desc: "Notifications for payment updates" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
              <ToggleSwitch
                enabled={notificationSettings[item.key]}
                onChange={(val) =>
                  setNotificationSettings({ ...notificationSettings, [item.key]: val })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Reminder Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reminder Before Appointment
            </label>
            <select
              value={notificationSettings.reminderTime}
              onChange={(e) =>
                setNotificationSettings({
                  ...notificationSettings,
                  reminderTime: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="1440">1 day</option>
            </select>
          </div>
          <div className="space-y-4">
            {[
              { key: "dailySummary", label: "Daily Summary" },
              { key: "weeklyReport", label: "Weekly Report" },
              { key: "urgentOnly", label: "Urgent Only" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <ToggleSwitch
                  enabled={notificationSettings[item.key]}
                  onChange={(val) =>
                    setNotificationSettings({ ...notificationSettings, [item.key]: val })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("notifications")}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Save Notification Settings
        </button>
      </div>
    </div>
  );

  const renderAppointmentSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Appointment Preferences
        </h4>
        <div className="space-y-4">
          {[
            { key: "autoAccept", label: "Auto-accept Appointments", desc: "Automatically accept all appointment requests" },
            { key: "requireConfirmation", label: "Require Confirmation", desc: "Patients must confirm their appointments" },
            { key: "allowRescheduling", label: "Allow Rescheduling", desc: "Patients can reschedule their appointments" },
            { key: "onlineConsultation", label: "Online Consultations", desc: "Offer video consultation appointments" },
            { key: "clinicVisit", label: "Clinic Visits", desc: "Offer in-person clinic appointments" },
            { key: "allowEmergency", label: "Emergency Appointments", desc: "Allow emergency appointment bookings" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
              <ToggleSwitch
                enabled={appointmentSettings[item.key]}
                onChange={(val) =>
                  setAppointmentSettings({ ...appointmentSettings, [item.key]: val })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Schedule Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Patients Per Day
            </label>
            <input
              type="number"
              value={appointmentSettings.maxPatientsPerDay}
              onChange={(e) =>
                setAppointmentSettings({
                  ...appointmentSettings,
                  maxPatientsPerDay: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Appointment Duration (min)
            </label>
            <select
              value={appointmentSettings.appointmentDuration}
              onChange={(e) =>
                setAppointmentSettings({
                  ...appointmentSettings,
                  appointmentDuration: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            >
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Buffer Time (min)
            </label>
            <select
              value={appointmentSettings.bufferTime}
              onChange={(e) =>
                setAppointmentSettings({
                  ...appointmentSettings,
                  bufferTime: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            >
              <option value="0">No buffer</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Advance Booking (days)
            </label>
            <select
              value={appointmentSettings.advanceBookingDays}
              onChange={(e) =>
                setAppointmentSettings({
                  ...appointmentSettings,
                  advanceBookingDays: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("appointments")}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Save Appointment Settings
        </button>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Profile Visibility
        </h4>
        <div className="space-y-4">
          {[
            { key: "showProfileInSearch", label: "Show in Search Results", desc: "Allow patients to find you in search" },
            { key: "showExperience", label: "Show Experience", desc: "Display years of experience on profile" },
            { key: "showReviews", label: "Show Reviews", desc: "Display patient reviews on your profile" },
            { key: "showFees", label: "Show Consultation Fees", desc: "Display consultation fees publicly" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
              <ToggleSwitch
                enabled={privacySettings[item.key]}
                onChange={(val) =>
                  setPrivacySettings({ ...privacySettings, [item.key]: val })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Security Settings
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={privacySettings.twoFactorAuth}
              onChange={(val) =>
                setPrivacySettings({ ...privacySettings, twoFactorAuth: val })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Login Alerts
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive alerts for new login attempts
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={privacySettings.loginAlerts}
              onChange={(val) =>
                setPrivacySettings({ ...privacySettings, loginAlerts: val })
              }
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Session Management
        </h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Auto Logout After (minutes)
          </label>
          <select
            value={privacySettings.sessionTimeout}
            onChange={(e) =>
              setPrivacySettings({ ...privacySettings, sessionTimeout: e.target.value })
            }
            className="w-full md:w-64 px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("privacy")}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Save Security Settings
        </button>
      </div>
    </div>
  );

  const renderMessageSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: "allowPatientMessages", label: "Allow Patient Messages", desc: "Enable direct messaging with patients" },
          { key: "autoReply", label: "Auto Reply", desc: "Send automatic reply to patient messages" },
          { key: "allowAttachments", label: "Allow Attachments", desc: "Allow patients to send files and images" },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {item.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
            <ToggleSwitch
              enabled={messageSettings[item.key]}
              onChange={(val) =>
                setMessageSettings({ ...messageSettings, [item.key]: val })
              }
            />
          </div>
        ))}
      </div>

      {messageSettings.autoReply && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Auto Reply Message
          </label>
          <textarea
            value={messageSettings.autoReplyMessage}
            onChange={(e) =>
              setMessageSettings({
                ...messageSettings,
                autoReplyMessage: e.target.value,
              })
            }
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Chat Availability
        </h4>
        <div className="space-y-3">
          {[
            { value: "always", label: "Always Available" },
            { value: "business-hours", label: "Business Hours Only" },
            { value: "custom", label: "Custom Schedule" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
            >
              <input
                type="radio"
                name="chatAvailability"
                value={option.value}
                checked={messageSettings.chatAvailability === option.value}
                onChange={(e) =>
                  setMessageSettings({
                    ...messageSettings,
                    chatAvailability: e.target.value,
                  })
                }
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("messages")}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Save Message Settings
        </button>
      </div>
    </div>
  );

  const renderPatientSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: "autoSharePrescriptions", label: "Auto-Share Prescriptions", desc: "Automatically share prescriptions with patients" },
          { key: "allowPatientNotes", label: "Allow Patient Notes", desc: "Patients can add notes to their appointments" },
          { key: "patientCanUpload", label: "Patient File Upload", desc: "Allow patients to upload medical documents" },
          { key: "showVisitHistory", label: "Show Visit History", desc: "Display complete visit history to patients" },
          { key: "showLabResults", label: "Show Lab Results", desc: "Share lab results with patients automatically" },
          { key: "allowPatientFeedback", label: "Allow Feedback", desc: "Allow patients to leave reviews and feedback" },
          { key: "newPatientApproval", label: "New Patient Approval", desc: "Require your approval for new patient registrations" },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {item.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
            <ToggleSwitch
              enabled={patientSettings[item.key]}
              onChange={(val) =>
                setPatientSettings({ ...patientSettings, [item.key]: val })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave("patients")}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Save Patient Settings
        </button>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      case "appointments":
        return renderAppointmentSettings();
      case "privacy":
        return renderPrivacySettings();
      case "messages":
        return renderMessageSettings();
      case "patients":
        return renderPatientSettings();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeSection === section.id
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700"
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{section.label}</p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 ml-auto transition-transform ${activeSection === section.id ? "rotate-90" : ""
                        }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {settingsSections.find((s) => s.id === activeSection)?.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {settingsSections.find((s) => s.id === activeSection)?.description}
              </p>
            </div>
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}