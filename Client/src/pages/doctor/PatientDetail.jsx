import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Activity,
  Heart,
  AlertCircle,
  FileText,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Video,
  Building2,
  PhoneCall,
} from "lucide-react";
import { generateDetailedPatients } from "../../utils/doctorPatientDummyData";

const tabOptions = [
  { value: "overview", label: "Overview" },
  { value: "appointments", label: "Appointments" },
  { value: "prescriptions", label: "Prescriptions" },
  { value: "messages", label: "Messages" },
  { value: "medical-history", label: "Medical History" },
];

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  // const [expandedSection, setExpandedSection] = useState(null);

  const allPatients = generateDetailedPatients();
  const patient = allPatients.find((p) => p._id === id);

  if (!patient) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Patient not found
        </h2>
        <button
          onClick={() => navigate("/d/patients")}
          className="text-green-600 dark:text-green-400 hover:underline"
        >
          Back to patients
        </button>
      </div>
    );
  }

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
      case "completed":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "cancelled":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-400";
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/d/patients")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Patient Details
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {getInitials(patient.firstName, patient.lastName)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {patient.firstName} {patient.lastName}
              </h3>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${patient.status === "In-Treatment"
                  ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                  : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                }`}>
                {patient.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(patient.dob)} ({calculateAge(patient.dob)} years)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gender & Blood Group</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {patient.gender} • {patient.bloodGroup}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {patient.mobile}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {patient.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {patient.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Emergency Contact
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {patient.emergencyContact.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {patient.emergencyContact.relation}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {patient.emergencyContact.phone}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                <Stethoscope className="w-4 h-4" />
                Start Consultation
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition text-sm font-medium">
                <MessageCircle className="w-4 h-4" />
                Send Message
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition text-sm font-medium">
                <FileText className="w-4 h-4" />
                Write Prescription
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
            <div className="border-b border-gray-200 dark:border-neutral-700">
              <div className="flex overflow-x-auto">
                {tabOptions.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === tab.value
                        ? "border-green-600 text-green-600 dark:text-green-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Vital Signs
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Height</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {patient.height} cm
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {patient.weight} kg
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">BMI</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {(patient.weight / ((patient.height / 100) ** 2)).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Current Medications
                    </h4>
                    {patient.currentMedications.length > 0 ? (
                      <div className="space-y-2">
                        {patient.currentMedications.map((med, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {med.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {med.dosage}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No current medications
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Allergies
                    </h4>
                    {patient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((allergy, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No known allergies
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Doctor Notes
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-700/50 p-4 rounded-lg">
                      {patient.notes}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "appointments" && (
                <div className="space-y-3">
                  {patient.appointments.length > 0 ? (
                    patient.appointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="p-4 rounded-lg border border-gray-100 dark:border-neutral-700 hover:border-green-200 dark:hover:border-green-800 transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {appointment.appointmentType === "online"
                                  ? "Online Consultation"
                                  : "Clinic Visit"}
                              </h5>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(appointment.appointmentDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {appointment.appointmentTime}
                              </span>
                            </div>
                          </div>
                          {appointment.appointmentType === "online" ? (
                            <Video className="w-5 h-5 text-green-500" />
                          ) : (
                            <Building2 className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        {appointment.symptoms && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Symptoms:</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {appointment.symptoms}
                            </p>
                          </div>
                        )}
                        {appointment.diagnosis && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Diagnosis:</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {appointment.diagnosis}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No appointments found
                    </p>
                  )}
                </div>
              )}

              {activeTab === "prescriptions" && (
                <div className="space-y-3">
                  {patient.prescriptions.length > 0 ? (
                    patient.prescriptions.map((prescription) => (
                      <div
                        key={prescription._id}
                        className="p-4 rounded-lg border border-gray-100 dark:border-neutral-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Prescription - {formatDate(prescription.date)}
                          </h5>
                          <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          {prescription.medications.map((med, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-neutral-700/50"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {med.name} {med.dosage}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {med.frequency} • {med.duration}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {prescription.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            {prescription.notes}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No prescriptions found
                    </p>
                  )}
                </div>
              )}

              {activeTab === "messages" && (
                <div className="space-y-3">
                  {patient.messages.length > 0 ? (
                    patient.messages.map((message) => (
                      <div
                        key={message._id}
                        className={`p-4 rounded-lg ${message.type === "sent"
                            ? "bg-green-50 dark:bg-green-900/10 ml-8"
                            : "bg-gray-50 dark:bg-neutral-700/50 mr-8"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {message.type === "sent" ? "You" : patient.firstName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {message.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {message.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No messages found
                    </p>
                  )}
                </div>
              )}

              {activeTab === "medical-history" && (
                <div className="space-y-4">
                  {patient.medicalHistory.length > 0 ? (
                    patient.medicalHistory.map((history, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-gray-100 dark:border-neutral-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {history.condition}
                          </h5>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(history.diagnosedDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {history.notes}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No medical history found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}