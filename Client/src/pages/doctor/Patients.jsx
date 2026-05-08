// pages/doctor/DoctorPatients.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Users,
  Loader,
} from "lucide-react";
import { getMyPatients } from "../../services/doctor.service";
import PatientStatsCard from "../../components/doctor/patients/PatientStatsCard";

const ITEMS_PER_PAGE = 10;

const statusFilters = [
  { value: "all", label: "All Patients" },
  { value: "In-Treatment", label: "In Treatment" },
  { value: "Out-Patient", label: "Out Patients" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name A to Z" },
  { value: "name-desc", label: "Name Z to A" },
  { value: "recent-visit", label: "Recent Visit" },
];

export default function DoctorPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inTreatment: 0,
    outPatient: 0,
    upcomingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch patients from API
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyPatients();

      if (response.data.success) {
        const patientsData = response.data.data.patients || [];
        setPatients(patientsData);

        // Calculate stats from fetched patients
        const total = patientsData.length;
        const inTreatment = patientsData.filter(p => p.lastStatus === "upcoming").length;
        const outPatient = patientsData.filter(p => p.lastStatus === "completed").length;

        // Calculate upcoming appointments (appointments in next 7 days)
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingAppointments = patientsData.filter(p => {
          if (!p.lastVisit) return false;
          const lastVisitDate = new Date(p.lastVisit);
          return lastVisitDate >= today && lastVisitDate <= nextWeek;
        }).length;

        setStats({
          total,
          inTreatment,
          outPatient,
          upcomingAppointments,
        });
      } else {
        setError("Failed to fetch patients");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching patients");
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((patient) => {
        const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
        return (
          fullName.includes(search) ||
          (patient.email && patient.email.toLowerCase().includes(search)) ||
          (patient.mobile && patient.mobile.includes(search)) ||
          (patient.bloodGroup && patient.bloodGroup.toLowerCase().includes(search))
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => {
        if (statusFilter === "In-Treatment") {
          return patient.lastStatus === "upcoming";
        } else if (statusFilter === "Out-Patient") {
          return patient.lastStatus === "completed";
        }
        return true;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) =>
          `${a.firstName || ''} ${a.lastName || ''}`.localeCompare(
            `${b.firstName || ''} ${b.lastName || ''}`
          )
        );
        break;
      case "name-desc":
        filtered.sort((a, b) =>
          `${b.firstName || ''} ${b.lastName || ''}`.localeCompare(
            `${a.firstName || ''} ${a.lastName || ''}`
          )
        );
        break;
      case "recent-visit":
        filtered.sort((a, b) =>
          new Date(b.lastVisit || 0) - new Date(a.lastVisit || 0)
        );
        break;
      case "newest":
      default:
        filtered.sort((a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
    }

    return filtered;
  }, [patients, searchTerm, statusFilter, sortBy]);

  const visiblePatients = filteredPatients.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPatients.length;

  const handlePatientClick = (patientId) => {
    navigate(`/d/patients/${patientId}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all" || sortBy !== "newest";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch (error) {
      return "N/A";
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  const getStatusBadge = (status) => {
    if (status === "upcoming") {
      return {
        label: "In Treatment",
        className: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
      };
    } else if (status === "completed") {
      return {
        label: "Out Patient",
        className: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
      };
    }
    return {
      label: "New",
      className: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
    };
  };

  if (loading && patients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Patients
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and view your patient records
          </p>
        </div>
      </div>

      <PatientStatsCard stats={stats} />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, phone, blood group..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${showFilters || hasActiveFilters
                  ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                  : "bg-gray-50 dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-600"
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
                  }`}
              />
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  >
                    {statusFilters.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {visiblePatients.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {filteredPatients.length}
              </span>{" "}
              patients
            </p>
          </div>

          {loading && patients.length > 0 && (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          )}

          <div className="space-y-3">
            {!loading && visiblePatients.length > 0 ? (
              visiblePatients.map((patient) => {
                const statusInfo = getStatusBadge(patient.lastStatus);
                return (
                  <div
                    key={patient._id}
                    onClick={() => handlePatientClick(patient._id)}
                    className="bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl p-4 sm:p-5 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="relative">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                              {getInitials(patient.firstName, patient.lastName)}
                            </span>
                          </div>
                          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800 ${patient.lastStatus === "upcoming"
                              ? "bg-amber-500"
                              : patient.lastStatus === "completed"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                              {patient.firstName || "Unknown"} {patient.lastName || ""}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                            {patient.dob && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>DOB: {formatDate(patient.dob)}</span>
                              </div>
                            )}
                            {patient.gender && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <User className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{patient.gender} {patient.bloodGroup ? `• ${patient.bloodGroup}` : ''}</span>
                              </div>
                            )}
                            {patient.mobile && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{patient.mobile}</span>
                              </div>
                            )}
                            {patient.email && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{patient.email}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {patient.lastVisit && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Last visit: {formatDate(patient.lastVisit)}
                              </span>
                            )}
                            {patient.totalAppointments > 0 && (
                              <span>
                                Total appointments: {patient.totalAppointments}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : !loading && visiblePatients.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No patients found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You don't have any patients yet. When patients book appointments with you, they'll appear here."}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : null}
          </div>

          {hasMore && !loading && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="px-6 py-2.5 bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-600 transition font-medium text-sm"
              >
                Load More Patients ({filteredPatients.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}