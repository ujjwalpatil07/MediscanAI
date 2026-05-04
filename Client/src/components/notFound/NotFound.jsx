import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUserMd,
  FaNotesMedical,
  FaUserInjured,
  FaStethoscope,
  FaHome,
  FaSearch,
  FaTimes,
  FaBrain,
  FaClipboardList
} from "react-icons/fa";
import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { filterByQuery } from "../../utils/searchUtils";
import doctorPatientImage from "../../../../assets/doctor_patient.png";
import Logo from "../logo/Logo";

/** ✅ ONLY VALID ROUTES */
const quickLinks = [
  { id: 1, title: "Home", path: "/home", icon: <FaHome className="mr-2" /> },
  { id: 2, title: "Find Doctors", path: "/doctors", icon: <FaUserMd className="mr-2" /> },
  { id: 3, title: "Patient Dashboard", path: "/p/dashboard", icon: <FaUserInjured className="mr-2" /> },
  { id: 4, title: "Book Appointment", path: "/doctors", icon: <FaCalendarAlt className="mr-2" /> },
  { id: 5, title: "My Appointments", path: "/p/my-appointments", icon: <FaClipboardList className="mr-2" /> },
  { id: 6, title: "Symptom Checker", path: "/p/symptom-checker", icon: <FaBrain className="mr-2" /> },
  { id: 7, title: "Prescriptions", path: "/p/prescriptions", icon: <FaNotesMedical className="mr-2" /> },
  { id: 8, title: "Profile", path: "/p/profile", icon: <FaUserInjured className="mr-2" /> },
];

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const displayedLinks = useMemo(() => {
    if (debouncedQuery.trim()) {
      return filterByQuery(quickLinks, debouncedQuery, "title");
    }
    return quickLinks.slice(0, 6);
  }, [debouncedQuery]);

  const isCurrentPath = (path) => {
    return location?.pathname === path || location?.pathname.startsWith(path + "/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] px-4">
      <div className="w-full max-w-6xl">
        <div className="md:flex items-center">

          {/* LEFT */}
          <div className="md:w-1/2 p-6">
            <Logo />

            <h1 className="text-7xl font-bold text-green-600 dark:text-green-400 mt-6">
              404
            </h1>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-2">
              Oops! Page not found
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-3 mb-6">
              The page you’re looking for doesn’t exist or may have been moved.
              Try navigating using the options below.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700 transition"
              >
                <FaHome className="mr-2" /> Go to Landing
              </button>

              <button
                onClick={() => navigate("/p/dashboard")}
                className="px-5 py-2 border border-green-600 text-green-700 rounded-lg flex items-center justify-center hover:bg-green-50 dark:hover:bg-neutral-800 transition"
              >
                <FaUserInjured className="mr-2" /> Dashboard
              </button>
            </div>

            {/* Search */}
            <div className="mb-2 font-medium text-green-700 dark:text-green-300 flex items-center">
              <FaSearch className="mr-2" /> Search pages
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search features..."
                className="w-full p-2 pl-9 pr-8 border rounded-lg bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <FaSearch className="absolute left-3 top-3 text-gray-400" />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2">
              {displayedLinks.length > 0 ? (
                displayedLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-2 border text-sm rounded-lg flex items-center transition ${isCurrentPath(item.path)
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-white dark:bg-neutral-900 border-gray-300 text-green-600 hover:bg-green-50"
                      }`}
                  >
                    {item.icon}
                    {item.title}
                  </button>
                ))
              ) : (
                <div className="text-gray-500 py-3 w-full text-center">
                  No results found
                </div>
              )}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="md:w-1/2 hidden md:flex items-center justify-center p-6">
            <img
              src={doctorPatientImage}
              alt="Doctor helping patient"
              className="w-full max-w-sm object-contain"
            />
          </div>

        </div>
      </div>
    </div>
  );
}