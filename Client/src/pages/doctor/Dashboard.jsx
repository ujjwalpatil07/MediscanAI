import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  Activity,
  MessageCircle,
  ChevronRight,
  Video,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Stethoscope,
  FileText,
  Star,
  Loader,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { getDashboardData } from "../../services/doctor.service";
import { getConversations } from "../../services/chat.service";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, chatRes] = await Promise.all([
        getDashboardData(),
        getConversations().catch(() => ({ data: { data: [] } })),
      ]);

      if (dashRes?.data?.success) {
        setDashboardData(dashRes.data.data);
      }
      if (chatRes?.data?.success) {
        setConversations(chatRes.data.data || []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = dashboardData?.stats || {};

  const statCards = [
    {
      label: "Total Patients",
      value: stats?.totalPatients || 0,
      change: stats?.patientGrowth || "+0%",
      trend: (stats?.patientGrowth || "0").startsWith("+") ? "up" : "down",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      change: `${stats?.pendingRequests || 0} pending`,
      trend: "up",
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Completed",
      value: stats?.completedAppointments || 0,
      change: "This month",
      trend: "up",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Revenue",
      value: `₹${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      change: "This month",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  const todayAppointments = dashboardData?.todayAppointmentsList || [];
  const upcomingAppointmentsList = dashboardData?.upcomingAppointments || [];
  const recentPatientsList = dashboardData?.recentPatients || [];
  const unreadMessages = stats?.unreadMessages || 0;

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n?.[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "online":
        return Video;
      case "clinic":
        return Building2;
      default:
        return Stethoscope;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, Dr. {loginUser?.firstName || "Doctor"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/d/messages")}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          >
            <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-4 sm:p-5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 sm:p-2.5 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
                {stat.trend && (
                  <span
                    className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Appointments */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Today&apos;s Appointments
                </h3>
                {todayAppointments.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    {todayAppointments.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate("/d/appointments")}
                className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4">
              {todayAppointments.length > 0 ? (
                <div className="space-y-2">
                  {todayAppointments.slice(0, 5).map((appt) => {
                    const TypeIcon = getTypeIcon(appt?.appointmentType);
                    return (
                      <div
                        key={appt?._id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-750 transition border border-transparent hover:border-gray-100 dark:hover:border-neutral-700"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                              {getInitials(appt?.patientName)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {appt?.patientName}
                            </h4>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {appt?.appointmentType || "Visit"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatTime(appt?.appointmentTime)}
                          </p>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {appt?.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No appointments today</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Patients
                </h3>
              </div>
              <button
                onClick={() => navigate("/d/patients")}
                className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              {recentPatientsList.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-neutral-700">
                      <th className="px-4 sm:px-6 py-3">Patient</th>
                      <th className="px-4 sm:px-6 py-3 hidden sm:table-cell">Gender</th>
                      <th className="px-4 sm:px-6 py-3">Last Visit</th>
                      <th className="px-4 sm:px-6 py-3">Status</th>
                      <th className="px-4 sm:px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentPatientsList.slice(0, 6).map((patient) => (
                      <tr
                        key={patient?._id}
                        className="border-b border-gray-50 dark:border-neutral-700/50 hover:bg-gray-50 dark:hover:bg-neutral-750 transition"
                      >
                        <td className="px-4 sm:px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                {getInitials(patient?.name)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white truncate">
                              {patient?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell capitalize">
                          {patient?.gender || "N/A"}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-gray-600 dark:text-gray-400">
                          {formatDate(patient?.lastVisit)}
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                            {patient?.status || "Active"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <button
                            onClick={() => navigate(`/d/patients/${patient?._id}`)}
                            className="text-xs text-green-600 dark:text-green-400 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No patients yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {loginUser?.profilePhoto ? (
                  <img src={loginUser.profilePhoto} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {loginUser?.firstName?.[0]}{loginUser?.lastName?.[0]}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  Dr. {loginUser?.firstName} {loginUser?.lastName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{loginUser?.specialty}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Experience</span>
                <span className="font-medium text-gray-900 dark:text-white">{loginUser?.yearsOfExperience || 0} years</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Fee</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{loginUser?.consultationFee || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Profile</span>
                <span className="font-medium text-green-600 dark:text-green-400">{loginUser?.profileCompletion || 0}% complete</span>
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Upcoming
              </h3>
              <span className="text-xs text-gray-400">Next 7 days</span>
            </div>
            {upcomingAppointmentsList.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointmentsList.slice(0, 5).map((appt) => (
                  <div key={appt?._id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {appt?.patientName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(appt?.appointmentDate)} at {formatTime(appt?.appointmentTime)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">No upcoming appointments</p>
            )}
          </div>

          {/* Recent Messages */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Messages</h3>
              </div>
              <button
                onClick={() => navigate("/d/messages")}
                className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-3 space-y-1">
              {conversations.length > 0 ? (
                conversations.slice(0, 4).map((conv) => (
                  <div
                    key={conv?.userId}
                    onClick={() => navigate(`/d/messages/${conv?.userId}`)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-750 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {getInitials(`${conv?.user?.firstName} ${conv?.user?.lastName}`)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {conv?.user?.firstName} {conv?.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {conv?.lastMessage?.message || "No messages"}
                      </p>
                    </div>
                    {conv?.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">No messages</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}