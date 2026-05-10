import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  SlidersHorizontal,
  RotateCcw,
  Loader,
} from "lucide-react";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../../services/doctor.service";
import AppointmentStatsCard from "../../components/doctor/appointments/AppointmentStatsCard";
import AppointmentCard from "../../components/doctor/appointments/AppointmentCard";
import UpcomingSidebar from "../../components/doctor/appointments/UpcomingSidebar";
import AppointmentTabs from "../../components/doctor/appointments/AppointmentTabs";

const ITEMS_PER_PAGE = 8;

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "date-asc", label: "Date: Earliest" },
  { value: "date-desc", label: "Date: Latest" },
  { value: "fee-high", label: "Fee: High to Low" },
  { value: "fee-low", label: "Fee: Low to High" },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "online", label: "Online Consultation" },
  { value: "clinic", label: "Clinic Visit" },
];

const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatusTab, setActiveStatusTab] = useState("upcoming");
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage, limit: ITEMS_PER_PAGE };
      if (dateRange !== "all") params.dateRange = dateRange;
      if (sortBy !== "newest") params.sort = sortBy;
      if (searchTerm) params.search = searchTerm;
      if (activeTypeFilter !== "all") params.type = activeTypeFilter;

      const response = await getDoctorAppointments(params);
      if (response?.data?.success) {
        setAppointments(response.data.data.appointments);
        setStats(response.data.data.stats);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  }, [dateRange, sortBy, currentPage, searchTerm, activeTypeFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchAppointments();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      fetchAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveStatusTab("upcoming");
    setActiveTypeFilter("all");
    setSortBy("newest");
    setDateRange("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || dateRange !== "all" || sortBy !== "newest";

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your patient appointments and schedules
          </p>
        </div>
      </div>

      <AppointmentStatsCard stats={stats} />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by patient name, email, phone or symptoms..."
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
                  {hasActiveFilters && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Appointment Type
                      </label>
                      <select
                        value={activeTypeFilter}
                        onChange={(e) => setActiveTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                      >
                        {typeOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date Range
                      </label>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                      >
                        {dateRangeOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            <AppointmentTabs
              activeStatusTab={activeStatusTab}
              setActiveStatusTab={setActiveStatusTab}
              activeTypeFilter={activeTypeFilter}
              setActiveTypeFilter={setActiveTypeFilter}
            />

            <div className="p-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-8 h-8 text-green-600 animate-spin" />
                </div>
              ) : (
                <AppointmentCard
                  appointments={appointments}
                  activeStatusTab={activeStatusTab}
                  activeTypeFilter={activeTypeFilter}
                  onStatusUpdate={handleStatusUpdate}
                />
              )}

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-80">
          <UpcomingSidebar appointments={appointments} loading={loading} />
        </div>
      </div>
    </div>
  );
}