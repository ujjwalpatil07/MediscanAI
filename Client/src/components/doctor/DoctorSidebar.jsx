import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  MessageCircle,
  User,
  Settings,
  LogOut,
  X,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    path: "/doctor/dashboard",
  },
  {
    title: "Appointment",
    icon: Calendar,
    path: "/doctor/appointments",
  },
  {
    title: "My Patients",
    icon: Users,
    path: "/doctor/patients",
  },
  {
    title: "Schedule Timings",
    icon: Calendar,
    path: "/doctor/schedule",
  },
  {
    title: "Payments",
    icon: CreditCard,
    path: "/doctor/payments",
  },
  {
    title: "Message",
    icon: MessageCircle,
    path: "/doctor/messages",
  },
  {
    title: "Blog",
    icon: MessageCircle,
    path: "/doctor/blog",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/doctor/settings",
  },
];

export default function DoctorSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/doctor/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } ${collapsed ? "w-20" : "w-64"} flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  MediscanAI
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Doctor Portal
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition hidden lg:block"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition lg:hidden"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${active
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700"
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm">{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-neutral-700">
          <Link
            to="/doctor/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Dr. Stephen Conley
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Cardiologist
                </p>
              </div>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full mt-1"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

DoctorSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};