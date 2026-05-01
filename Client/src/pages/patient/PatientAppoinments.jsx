import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, Calendar, Clock } from "lucide-react";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import AppointmentSidebar from "../../components/appointments/AppointmentSidebar";
import AppointmentStats from "../../components/appointments/AppointmentStats";
import { generateDummyAppointments } from "../../utils/appointmentDummyData";

const ITEMS_PER_PAGE = 5;

const filterOptions = {
  status: ["all", "upcoming", "completed", "cancelled"],
  sort: ["newest", "oldest", "fee-high", "fee-low"],
  type: ["all", "video", "in-person", "phone"],
};

export default function PatientAppointments() {
  const [appointments] = useState(() => generateDummyAppointments());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);

  const uniqueDoctors = useMemo(() => {
    const doctors = appointments.map((appt) => appt.doctor);
    return [
      { id: "all", firstName: "All", lastName: "Doctors", specialty: "" },
      ...doctors.filter(
        (doc, index, self) =>
          index === self.findIndex((d) => d.id === doc.id)
      ),
    ];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (appt) =>
          `${appt.doctor.firstName} ${appt.doctor.lastName}`
            .toLowerCase()
            .includes(search) ||
          appt.doctor.specialty.toLowerCase().includes(search) ||
          appt.symptoms.toLowerCase().includes(search)
      );
    }

    if (selectedDoctor !== "all") {
      filtered = filtered.filter((appt) => appt.doctorId === selectedDoctor);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((appt) => appt.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (appt) => appt.appointmentType === typeFilter
      );
    }

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.appointmentDate) - new Date(b.appointmentDate)
        );
        break;
      case "fee-high":
        filtered.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
      case "fee-low":
        filtered.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      default:
        break;
    }

    return filtered;
  }, [appointments, searchTerm, selectedDoctor, statusFilter, typeFilter, sortBy]);

  const visibleAppointments = filteredAppointments.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAppointments.length;

  const upcomingAppointments = appointments
    .filter((appt) => appt.status === "upcoming")
    .sort(
      (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
    );

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      upcoming: appointments.filter((a) => a.status === "upcoming").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };
  }, [appointments]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDoctor("all");
    setStatusFilter("all");
    setSortBy("newest");
    setTypeFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Appointments
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your medical appointments
          </p>
        </div>

        <AppointmentStats stats={stats} />

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by doctor name, specialty, or symptoms..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-600 transition text-sm"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="fee-high">Fee: High to Low</option>
                  <option value="fee-low">Fee: Low to High</option>
                </select>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Doctor
                      </label>
                      <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                      >
                        {uniqueDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.firstName} {doc.lastName}{" "}
                            {doc.specialty && `- ${doc.specialty}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Appointment Type
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="video">Video Call</option>
                        <option value="in-person">In Person</option>
                        <option value="phone">Phone Call</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="mt-3 text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {visibleAppointments.length > 0 ? (
                visibleAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No appointments found
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-green-600 dark:text-green-400 hover:underline text-sm"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-white dark:bg-neutral-800 text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-neutral-700 transition font-medium text-sm"
                >
                  Load More Appointments ({filteredAppointments.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>

          <div className="lg:w-80">
            <AppointmentSidebar upcomingAppointments={upcomingAppointments} />
          </div>
        </div>
      </div>
    </div>
  );
}