import { useState } from "react";
import { Search, Plus, MoreVertical, Phone, Mail, MapPin } from "lucide-react";
import { generatePatientsList } from "../../utils/doctorDummyData";

const statusColors = {
  "In-Treatment": "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  "Out-Patient": "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
};

export default function DoctorPatients() {
  const [patients] = useState(generatePatientsList);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Patients
        </h2>
        <button
          onClick={() => setShowAddPatient(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" /> Add New Patient
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
            </div>
            <select className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm">
              <option>Show 10</option>
              <option>Show 25</option>
              <option>Show 50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                <th className="px-6 py-3">Patient Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Date Of Joining</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-t border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {patient.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {patient.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 max-w-xs">
                      <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {patient.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]
                        }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 dark:text-gray-400">
                      {patient.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 dark:text-gray-400">
                      {patient.dateOfJoining}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition">
                        Log Consulting
                      </button>
                      <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}