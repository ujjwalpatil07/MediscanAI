import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal,
  RotateCcw,
  Plus,
  Users,
  Activity,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  generateDetailedPatients,
  generatePatientStats,
} from "../../utils/doctorPatientDummyData";
import PatientStatsCard from "../../components/doctor/patients/PatientStatsCard";

const ITEMS_PER_PAGE = 8;

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
  const [allPatients] = useState(generateDetailedPatients);
  const [stats] = useState(generatePatientStats);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPatients = useMemo(() => {
    let filtered = [...allPatients];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        return (
          fullName.includes(search) ||
          patient.email.toLowerCase().includes(search) ||
          patient.mobile.includes(search) ||
          patient.bloodGroup.toLowerCase().includes(search) ||
          patient.medicalHistory.some((mh) =>
            mh.condition.toLowerCase().includes(search)
          )
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (patient) => patient.status === statusFilter
      );
    }

    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          )
        );
        break;
      case "name-desc":
        filtered.sort((a, b) =>
          `${b.firstName} ${b.lastName}`.localeCompare(
            `${a.firstName} ${a.lastName}`
          )
        );
        break;
      case "recent-visit":
        filtered.sort(
          (a, b) =>
            new Date(b.lastVisit || 0) - new Date(a.lastVisit || 0)
        );
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b._id.localeCompare(a._id));
        break;
    }

    return filtered;
  }, [allPatients, searchTerm, statusFilter, sortBy]);

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
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

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
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" />
          Add New Patient
        </button>
      </div>

      <PatientStatsCard stats={stats} />

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, phone, blood group, or condition..."
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

          <div className="space-y-3">
            {visiblePatients.length > 0 ? (
              visiblePatients.map((patient) => (
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
                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800 ${patient.status === "In-Treatment"
                            ? "bg-amber-500"
                            : "bg-green-500"
                          }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${patient.status === "In-Treatment"
                              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                              : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            }`}>
                            {patient.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>DOB: {formatDate(patient.dob)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <User className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{patient.gender} • {patient.bloodGroup}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{patient.mobile}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{patient.email}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {patient.medicalHistory.slice(0, 5).map((condition, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400"
                            >
                              {condition.condition}
                            </span>
                          ))}
                          {patient.medicalHistory.length > 5 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{patient.medicalHistory.length - 5} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>Last visit: {formatDate(patient.lastVisit)}</span>
                          {patient.nextAppointment && (
                            <span className="text-green-600 dark:text-green-400">
                              Next: {formatDate(patient.nextAppointment)}
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
              ))
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No patients found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {hasMore && (
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