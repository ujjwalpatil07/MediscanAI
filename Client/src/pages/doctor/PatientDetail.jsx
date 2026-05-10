import { useState, useEffect, useContext } from "react";
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
  Loader,
  Cake,
  Droplet,
  Ruler,
  Weight,
  Shield,
  UserPlus,
} from "lucide-react";
import { getDoctorPatientById } from "../../services/doctor.service";

const tabOptions = [
  { value: "overview", label: "Overview" },
  { value: "appointments", label: "Appointments" },
  { value: "prescriptions", label: "Prescriptions" },
  { value: "medical-history", label: "Medical History" },
];

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDoctorPatientById(id);
        if (response?.data?.success) {
          setPatientData(response.data.data);
        } else {
          setError("Patient not found");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  const calculateAge = (dob) => {
    if (!dob) return null;
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

  const formatTime = (datetime) => {
    if (!datetime) return "N/A";
    const date = new Date(datetime);
    if (isNaN(date.getTime())) return "N/A";
    const h = date.getHours() % 12 || 12;
    const m = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${h}:${m} ${ampm}`;
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
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error || !patientData?.patient) {
    return (
      <div className="text-center py-16">
        <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Patient Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error || "Patient not found"}</p>
        <button
          onClick={() => navigate("/d/patients")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  const patient = patientData.patient;
  const appointments = patientData.appointments || [];
  const prescriptions = patientData.prescriptions || [];
  const stats = patientData.stats || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/d/patients")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 sticky top-20">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {patient?.profilePhoto ? (
                  <img
                    src={patient.profilePhoto}
                    alt={`${patient?.firstName} ${patient?.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {getInitials(patient?.firstName, patient?.lastName)}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {patient?.firstName} {patient?.lastName}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{patient?.gender || "N/A"}</span>
                {patient?.dob && (
                  <>
                    <span>•</span>
                    <span>{calculateAge(patient.dob)} years</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {patient?.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {patient.email}
                    </p>
                  </div>
                </div>
              )}

              {patient?.mobile && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {patient.mobile}
                    </p>
                  </div>
                </div>
              )}

              {patient?.address && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {patient.address}
                    </p>
                  </div>
                </div>
              )}

              {patient?.bloodGroup && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                  <Droplet className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {patient.bloodGroup}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Vitals */}
            {(patient?.height || patient?.weight) && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Vitals</h4>
                <div className="grid grid-cols-2 gap-3">
                  {patient?.height && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50 text-center">
                      <Ruler className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{patient.height} cm</p>
                      <p className="text-xs text-gray-500">Height</p>
                    </div>
                  )}
                  {patient?.weight && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50 text-center">
                      <Weight className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{patient.weight} kg</p>
                      <p className="text-xs text-gray-500">Weight</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {patient?.emergencyContact?.name && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Emergency Contact</h4>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {patient.emergencyContact.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {patient.emergencyContact.relation}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {patient.emergencyContact.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                <Stethoscope className="w-4 h-4" />
                Start Consultation
              </button>
              <button
                onClick={() => navigate(`/d/messages/${patient?._id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition text-sm font-medium"
              >
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

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalAppointments || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Visits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.completedAppointments || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {prescriptions.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Prescriptions</p>
              </div>
            </div>

            {/* Tabs */}
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
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {patient?.allergies?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Allergies</h4>
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((allergy, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient?.currentMedications?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Current Medications</h4>
                      <div className="space-y-2">
                        {patient.currentMedications.map((med, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{med.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{med.dosage}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient?.medicalHistory?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Medical History</h4>
                      <div className="space-y-2">
                        {patient.medicalHistory.map((item, idx) => (
                          <div key={idx} className="p-3 rounded-lg border border-gray-100 dark:border-neutral-700">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.condition}</p>
                              <span className="text-xs text-gray-400">{formatDate(item.diagnosedDate)}</span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!patient?.allergies?.length && !patient?.currentMedications?.length && (
                    <p className="text-sm text-gray-400 text-center py-8">No additional medical information</p>
                  )}
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === "appointments" && (
                <div className="space-y-3">
                  {appointments.length > 0 ? (
                    appointments.map((appt) => {
                      const TypeIcon = appt?.appointmentType === "online" ? Video : Building2;
                      return (
                        <div
                          key={appt?._id}
                          className="p-4 rounded-lg border border-gray-100 dark:border-neutral-700 hover:border-green-200 dark:hover:border-green-800 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <TypeIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                  {appt?.appointmentType || "Visit"}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(appt?.status)}`}>
                                  {appt?.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(appt?.appointmentDate)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(appt?.appointmentTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                          {appt?.symptoms && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              <span className="font-medium">Symptoms:</span> {appt.symptoms}
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">No appointments found</p>
                  )}
                </div>
              )}

              {/* Prescriptions Tab */}
              {activeTab === "prescriptions" && (
                <div className="space-y-3">
                  {prescriptions.length > 0 ? (
                    prescriptions.map((pres) => (
                      <div
                        key={pres?._id}
                        className="p-4 rounded-lg border border-gray-100 dark:border-neutral-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            Prescription - {formatDate(pres?.date)}
                          </span>
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          {pres?.medicines?.slice(0, 3).map((med, idx) => (
                            <p key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                              {med.name} {med.dosage} - {med.frequency}
                            </p>
                          ))}
                          {pres?.medicines?.length > 3 && (
                            <p className="text-xs text-gray-400">+{pres.medicines.length - 3} more</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">No prescriptions found</p>
                  )}
                </div>
              )}

              {/* Medical History Tab */}
              {activeTab === "medical-history" && (
                <div className="space-y-3">
                  {patient?.medicalHistory?.length > 0 ? (
                    patient.medicalHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-gray-100 dark:border-neutral-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.condition}
                          </h5>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.diagnosedDate)}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.notes}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">No medical history</p>
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