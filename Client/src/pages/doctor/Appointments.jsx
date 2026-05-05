import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  Video,
  Building2,
  Check,
  X,
  ChevronRight,
  User,
  Phone,
  Mail,
  MoreVertical,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import {
  generateDoctorAppointments,
  generateAppointmentStats,
} from "../../utils/doctorAppointmentDummyData";
import AppointmentStatsCard from "../../components/doctor/appointments/AppointmentStatsCard";
import AppointmentCard from "../../components/doctor/appointments/AppointmentCard"
import UpcomingSidebar from "../../components/doctor/appointments/UpcomingSidebar";

const ITEMS_PER_PAGE = 8;

const statusOptions = [
  { value: "all", label: "All Appointments" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "date-asc", label: "Date: Earliest" },
  { value: "date-desc", label: "Date: Latest" },
  { value: "fee-high", label: "Fee: High to Low" },
  { value: "fee-low", label: "Fee: Low to High" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "online", label: "Online Consultation" },
  { value: "clinic-visit", label: "Clinic Visit" },
];

export default function DoctorAppointments() {
  const [allAppointments] = useState(generateDoctorAppointments);
  const [stats] = useState(generateAppointmentStats);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAppointments = useMemo(() => {
    let filtered = [...allAppointments];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((appt) => {
        const patientName = `${appt.patient.firstName} ${appt.patient.lastName}`.toLowerCase();
        return (
          patientName.includes(search) ||
          appt.symptoms.toLowerCase().includes(search) ||
          appt.patient.email.toLowerCase().includes(search) ||
          appt.patient.phone.includes(search)
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((appt) => appt.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((appt) => appt.appointmentType === typeFilter);
    }

    if (dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((appt) => {
        const apptDate = new Date(appt.appointmentDate);
        switch (dateRange) {
          case "today":
            return apptDate.toDateString() === today.toDateString();
          case "week":
            return apptDate >= weekAgo;
          case "month":
            return apptDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "date-asc":
        filtered.sort(
          (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
        );
        break;
      case "date-desc":
        filtered.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        break;
      case "fee-high":
        filtered.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
      case "fee-low":
        filtered.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case "name-asc":
        filtered.sort((a, b) =>
          `${a.patient.firstName} ${a.patient.lastName}`.localeCompare(
            `${b.patient.firstName} ${b.patient.lastName}`
          )
        );
        break;
      case "name-desc":
        filtered.sort((a, b) =>
          `${b.patient.firstName} ${b.patient.lastName}`.localeCompare(
            `${a.patient.firstName} ${a.patient.lastName}`
          )
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [allAppointments, searchTerm, statusFilter, sortBy, typeFilter, dateRange]);

  const visibleAppointments = filteredAppointments.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAppointments.length;

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return allAppointments
      .filter((appt) => {
        const apptDate = new Date(appt.appointmentDate);
        return (
          appt.status === "upcoming" && apptDate >= new Date(now.toDateString())
        );
      })
      .sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
      );
  }, [allAppointments]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("newest");
    setTypeFilter("all");
    setDateRange("all");
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    dateRange !== "all" ||
    sortBy !== "newest";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Appointments
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your patient appointments and schedules
          </p>
        </div>
      </div>

      <AppointmentStatsCard stats={stats} />

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Appointment Type
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                      >
                        {typeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
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
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
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
                    {visibleAppointments.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {filteredAppointments.length}
                  </span>{" "}
                  appointments
                </p>
              </div>

              <div className="space-y-3">
                {visibleAppointments.length > 0 ? (
                  visibleAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                    />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No appointments found
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
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-600 transition font-medium text-sm"
                  >
                    Load More Appointments ({filteredAppointments.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-80">
          <UpcomingSidebar upcomingAppointments={upcomingAppointments} />
        </div>
      </div>
    </div>
  );
}