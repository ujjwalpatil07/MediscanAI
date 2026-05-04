import { useState } from "react";
import {
  Users,
  Building2,
  Calendar,
  Clock,
  TrendingUp,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import {
  doctorInfo,
  generateAppointmentRequests,
  generateTodayAppointments,
  generateRecentPatients,
} from "../../utils/doctorDummyData";

const stats = [
  {
    title: "Total Patient",
    value: "24.4k",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    change: "+12%",
  },
  {
    title: "Clinic Consulting",
    value: "166.3k",
    icon: Building2,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    change: "+8%",
  },
  {
    title: "Total Appointments",
    value: "53.5k",
    icon: Calendar,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    change: "+15%",
  },
];

const patientStatusData = {
  confirmed: 45,
  declined: 12,
  newPatient: 23,
};

const genderData = {
  male: 55,
  female: 35,
  child: 10,
};

export default function DoctorDashboard() {
  const [appointmentRequests] = useState(generateAppointmentRequests);
  const [todayAppointments] = useState(generateTodayAppointments);
  const [recentPatients] = useState(generateRecentPatients);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const currentWeek = [3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, Dr. {doctorInfo.firstName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Have a nice day at great work
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>
            {currentWeek[0]} - {currentWeek[currentWeek.length - 1]} May, 2021
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appointment Request
              </h3>
              <button className="text-sm text-green-600 dark:text-green-400 hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {appointmentRequests.slice(0, 7).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.patientName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {appointment.gender}, {appointment.date}{" "}
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Patients
              </h3>
              <button className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    <th className="pb-3">Patient Name</th>
                    <th className="pb-3">Visit Id</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Gender</th>
                    <th className="pb-3">Diseases</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-t border-gray-100 dark:border-neutral-700"
                    >
                      <td className="py-3 text-gray-900 dark:text-white font-medium">
                        {patient.name}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        {patient.visitId}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        {patient.date}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        {patient.gender}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        {patient.disease}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Patients
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Confirmed
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {patientStatusData.confirmed}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${patientStatusData.confirmed}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Declined
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {patientStatusData.declined}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full">
                  <div
                    className="h-2 bg-red-500 rounded-full"
                    style={{ width: `${patientStatusData.declined}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    New Patient
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {patientStatusData.newPatient}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${patientStatusData.newPatient}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Gender
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  Male {genderData.male}%
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
                  Female {genderData.female}%
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                  Child {genderData.child}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Today Appointments
              </h3>
              <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
            </div>
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.patientName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {appointment.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.time}
                    </p>
                    <p
                      className={`text-xs ${appointment.status === "Ongoing"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                      {appointment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Next Week
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Upcoming Schedules - 2
            </p>
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentWeek[0]} - {currentWeek[currentWeek.length - 1]} May,
                2021
              </span>
            </div>
            <div className="flex justify-between">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {day}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${index >= 2 && index <= 4
                        ? "bg-green-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700"
                      }`}
                  >
                    {currentWeek[index]}
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