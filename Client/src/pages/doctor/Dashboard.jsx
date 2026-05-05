import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
  Star,
  MessageCircle,
  ChevronRight,
  MoreVertical,
  Video,
  Building2,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Mail,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  HeartPulse,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";

const stats = [
  {
    label: "Total Patients",
    value: "2,450",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    label: "Today's Appointments",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Calendar,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    label: "Pending Requests",
    value: "5",
    change: "-1",
    trend: "down",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    label: "Revenue This Month",
    value: "₹42,500",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
];

const todayAppointments = [
  {
    _id: "apt1",
    patientName: "Jhon Smith",
    type: "Clinic Consulting",
    time: "09:15 AM",
    status: "Ongoing",
    patientPhoto: null,
    appointmentType: "clinic-visit",
  },
  {
    _id: "apt2",
    patientName: "Frank Murray",
    type: "Video Consulting",
    time: "10:25 AM",
    status: "Upcoming",
    patientPhoto: null,
    appointmentType: "online",
  },
  {
    _id: "apt3",
    patientName: "Ella Lucia",
    type: "Emergency",
    time: "11:30 AM",
    status: "Upcoming",
    patientPhoto: null,
    appointmentType: "clinic-visit",
  },
  {
    _id: "apt4",
    patientName: "Alyssa Dehn",
    type: "Clinic Consulting",
    time: "12:20 PM",
    status: "Upcoming",
    patientPhoto: null,
    appointmentType: "clinic-visit",
  },
  {
    _id: "apt5",
    patientName: "Robert Fox",
    type: "Online Consultation",
    time: "02:00 PM",
    status: "Upcoming",
    patientPhoto: null,
    appointmentType: "online",
  },
];

const appointmentRequests = [
  {
    _id: "req1",
    patientName: "Bogdan Krivenchenko",
    age: 45,
    gender: "Male",
    date: "12 April",
    time: "9:30 AM",
    symptoms: "Chest pain during exercise",
    type: "clinic-visit",
  },
  {
    _id: "req2",
    patientName: "Jenny Wilson",
    age: 32,
    gender: "Female",
    date: "25 April",
    time: "10:30 AM",
    symptoms: "Irregular heartbeat",
    type: "online",
  },
  {
    _id: "req3",
    patientName: "Dianne Russel",
    age: 28,
    gender: "Female",
    date: "Today",
    time: "2:30 PM",
    symptoms: "Shortness of breath",
    type: "clinic-visit",
  },
  {
    _id: "req4",
    patientName: "Annette Black",
    age: 55,
    gender: "Female",
    date: "Today",
    time: "4:00 PM",
    symptoms: "High blood pressure follow-up",
    type: "online",
  },
];

const recentPatients = [
  {
    _id: "rp1",
    name: "Deveon Lane",
    visitId: "OPD-2345",
    date: "5/7/21",
    gender: "Male",
    disease: "Diabetes",
    status: "Out-Patient",
    lastVisit: "2025-01-15",
  },
  {
    _id: "rp2",
    name: "Albert Flores",
    visitId: "IPD-2424",
    date: "5/7/21",
    gender: "Male",
    disease: "Hypertension",
    status: "Out-Patient",
    lastVisit: "2025-01-14",
  },
  {
    _id: "rp3",
    name: "Sarah Johnson",
    visitId: "OPD-2456",
    date: "4/7/21",
    gender: "Female",
    disease: "Hyperlipidemia",
    status: "In-Treatment",
    lastVisit: "2025-01-13",
  },
  {
    _id: "rp4",
    name: "Michael Brown",
    visitId: "OPD-2467",
    date: "4/7/21",
    gender: "Male",
    disease: "Atrial Fibrillation",
    status: "In-Treatment",
    lastVisit: "2025-01-12",
  },
];

const messages = [
  {
    _id: "msg1",
    sender: "Jane Martin",
    message: "Good Morning, What's the matter?",
    time: "Today 7:55 am",
    unread: true,
    online: true,
  },
  {
    _id: "msg2",
    sender: "John Smith",
    message: "I hope you get well soon",
    time: "17:10",
    unread: false,
  },
  {
    _id: "msg3",
    sender: "Hannah Smith",
    message: "I have prescribed for you...",
    time: "05/04/21",
    unread: false,
  },
  {
    _id: "msg4",
    sender: "Mr. Jhon Doe",
    message: "You need to do a lab check",
    time: "Yesterday",
    unread: false,
  },
];

const upcomingAppointments = [
  {
    _id: "up1",
    patientName: "Emily Davis",
    type: "Online",
    date: "Jan 20, 2025",
    time: "10:00 AM",
  },
  {
    _id: "up2",
    patientName: "David Miller",
    type: "Clinic",
    date: "Jan 22, 2025",
    time: "11:30 AM",
  },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("today");
  const { loginUser } = useContext(AuthContext);


  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Ongoing":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "Upcoming":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
      case "In-Treatment":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
      case "Out-Patient":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      default:
        return "bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, Dr. {loginUser?.firstName || "Doctor"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Have a nice day at great work
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-xs font-medium ${stat.trend === "up"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                    }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Today's Appointments
                </h3>
              </div>
              <button
                onClick={() => navigate("/d/appointments")}
                className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-750 transition border border-gray-50 dark:border-neutral-700/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {getInitials(appointment.patientName)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {appointment.patientName}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {appointment.appointmentType === "online" ? (
                          <Video className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-green-500" />
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {appointment.type}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.time}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Appointment Requests
                </h3>
              </div>
              <button
                onClick={() => navigate("/d/appointments")}
                className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {appointmentRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-750 transition border border-gray-50 dark:border-neutral-700/50"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {getInitials(request.patientName)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {request.patientName}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {request.gender}, {request.age} • {request.date} at{" "}
                        {request.time}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {request.symptoms}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Patients
                </h3>
              </div>
              <button
                onClick={() => navigate("/d/patients")}
                className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-neutral-700">
                    <th className="px-6 py-3">Patient Name</th>
                    <th className="px-6 py-3">Visit ID</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Gender</th>
                    <th className="px-6 py-3">Diseases</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentPatients.map((patient) => (
                    <tr
                      key={patient._id}
                      className="border-b border-gray-50 dark:border-neutral-700/50 hover:bg-gray-50 dark:hover:bg-neutral-750 transition"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                              {getInitials(patient.name)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                        {patient.visitId}
                      </td>
                      <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                        {patient.date}
                      </td>
                      <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                        {patient.gender}
                      </td>
                      <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                        {patient.disease}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(patient.status)}`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button className="text-sm text-green-600 dark:text-green-400 hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Patient Statistics
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">New Patients</span>
                  <span className="text-gray-900 dark:text-white font-medium">45%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">In Treatment</span>
                  <span className="text-gray-900 dark:text-white font-medium">35%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full">
                  <div className="h-2 bg-amber-500 rounded-full" style={{ width: "35%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Recovered</span>
                  <span className="text-gray-900 dark:text-white font-medium">20%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: "20%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Messages
                </h3>
              </div>
              <button
                onClick={() => navigate("/d/messages")}
                className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-750 transition cursor-pointer"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {getInitials(msg.sender)}
                      </span>
                    </div>
                    {msg.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {msg.sender}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {msg.message}
                    </p>
                  </div>
                  {msg.unread && (
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Upcoming
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Next 7 days
              </span>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.patientName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {appointment.type} • {appointment.date}
                    </p>
                    <p className="text-xs text-gray-400">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}