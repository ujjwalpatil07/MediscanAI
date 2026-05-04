import { useState } from "react";
import { Search, Filter, Calendar, Clock, Video, Phone, User } from "lucide-react";
import { generateTodayAppointments } from "../../utils/doctorDummyData";

const tabs = ["All Appointments", "Upcoming", "Completed", "Cancelled"];

export default function DoctorAppointments() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments] = useState(generateTodayAppointments);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Appointments
        </h2>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition">
          + New Appointment
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
        <div className="border-b border-gray-200 dark:border-neutral-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === index
                    ? "border-green-600 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search appointments..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-neutral-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-neutral-700 hover:border-green-300 dark:hover:border-green-700 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {appointment.patientName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {appointment.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {appointment.time}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === "Ongoing"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                        : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      }`}
                  >
                    {appointment.status}
                  </span>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                    <Video className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}