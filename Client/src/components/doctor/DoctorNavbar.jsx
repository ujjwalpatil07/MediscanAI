import { useState } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  Search,
  Bell,
  MessageCircle,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";

export default function DoctorNavbar({ onMenuClick }) {
  const navigate = useNavigate(); 
  const {loginUser} = useContext(AuthContext)
  const { theme, toggleTheme } = useThemeContext();


  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 h-16">
      <div className="flex items-center justify-between px-4 sm:px-6 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Welcome, Dr. {loginUser?.firstName}
            </h1>
            <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-400">
              Have a nice day at great work
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 w-48 lg:w-64 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
            title={theme == "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme == "dark" ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          <button
            onClick={() => navigate("/d/messages")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition relative"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={() => navigate("/d/messages")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition relative"
          >
            <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-neutral-700">
            <button
              onClick={() => navigate("/d/profile")}
              className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition"
            >
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

DoctorNavbar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};