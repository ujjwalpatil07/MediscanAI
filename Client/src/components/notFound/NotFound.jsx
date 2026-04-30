import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUserMd,
  FaAmbulance,
  FaClinicMedical,
  FaNotesMedical,
  FaHospitalAlt,
  FaPills,
  FaFileInvoiceDollar,
  FaUserInjured,
  FaStethoscope,
  FaHome,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { filterByQuery } from "../../utils/searchUtils";
import doctorPatientImage from "../../../../assets/doctor_patient.png";
import Logo from "../logo/Logo";

const quickLinks = [
  { id: 1, title: "Book Appointment", path: "/appointments", icon: <FaCalendarAlt className="mr-2" /> },
  { id: 2, title: "Find Specialists", path: "/specialists", icon: <FaUserMd className="mr-2" /> },
  { id: 3, title: "Emergency Care", path: "/emergency", icon: <FaAmbulance className="mr-2" /> },
  { id: 4, title: "Health Packages", path: "/packages", icon: <FaHospitalAlt className="mr-2" /> },
  { id: 5, title: "Patient Portal", path: "/portal", icon: <FaUserInjured className="mr-2" /> },
  { id: 6, title: "Contact Support", path: "/contact", icon: <FaClinicMedical className="mr-2" /> },
  { id: 7, title: "Medical Records", path: "/records", icon: <FaNotesMedical className="mr-2" /> },
  { id: 8, title: "Lab Test Booking", path: "/lab-tests", icon: <FaStethoscope className="mr-2" /> },
  { id: 9, title: "Pharmacy", path: "/pharmacy", icon: <FaPills className="mr-2" /> },
  { id: 10, title: "Billing & Payments", path: "/billing", icon: <FaFileInvoiceDollar className="mr-2" /> },
];

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 400);

  // Memoize the filtered links to prevent unnecessary recalculations
  const displayedLinks = useMemo(() => {
    const filtered = debouncedQuery.trim()
      ? filterByQuery(quickLinks, debouncedQuery, "title")
      : [...quickLinks].sort(() => 0.5 - Math.random()).slice(0, 5);

    return filtered;
  }, [debouncedQuery]);

  const isCurrentPath = (path) => {
    return location?.pathname === path || location?.pathname.startsWith(path + "/");
  };


  return (
    <div className="w-full">
      <div className="max-w-5xl bg-white dark:dark:bg-neutral-800/50 rounded-xl shadow-md mx-auto border border-gray-200 dark:border-gray-700">
        <div className="md:flex">
          <div className="md:w-1/2 flex flex-col justify-center p-3 md:p-6">
            <Logo />

            <h1 className="text-6xl font-bold text-green-600 dark:text-green-400 mt-6 mb-2">404</h1>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-3">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The page you're looking for does not exist. Please use the options below to continue.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg flex items-center justify-center hover:bg-green-700 transition"
              >
                <FaHome className="mr-2" /> Home
              </button>
              <button
                onClick={() => navigate("/doctors")}
                className="px-4 py-2 border border-green-600 text-green-700 font-medium rounded-lg bg-white dark:bg-neutral-900 flex items-center justify-center hover:bg-green-50 dark:hover:bg-neutral-800 transition"
              >
                <FaUserMd className="mr-2" /> Find a Doctor
              </button>
            </div>

            <div className="mb-2 font-medium text-green-700 dark:text-green-300 flex items-center">
              <FaSearch className="mr-2" /> Quick Search
            </div>

            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search for pages..."
                className="w-full p-2 pl-9 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {displayedLinks.length > 0 ? (
                displayedLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path ?? "/")}
                    className={`px-3 py-2 border text-sm rounded-lg flex items-center transition ${isCurrentPath(item.path)
                        ? "bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300"
                        : "bg-white dark:bg-neutral-900 border-gray-300 dark:border-gray-600 text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-neutral-800"
                      }`}
                  >
                    {item.icon}
                    {item.title}
                  </button>
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-300 py-3 text-center w-full">
                  No results found
                </div>
              )}
            </div>
          </div>

          <div className="md:w-1/2 hidden md:flex items-center justify-center p-6">
            <img
              src={doctorPatientImage}
              alt="Doctor helping patient"
              className="w-full max-w-xs h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}