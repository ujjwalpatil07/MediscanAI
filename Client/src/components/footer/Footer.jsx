import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { FaMoon, FaSun } from "react-icons/fa";
import Logo from "../logo/Logo";
import { useThemeContext } from "../../context/ThemeContext";

export default function Footer() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <footer className="bg-gray-100 text-gray-800 dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] dark:text-gray-300 pt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & Description */}
        <div>
          <Logo />
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
            MediCare is your trusted health partner, providing modern solutions
            for patients, doctors, and administrators.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Links
          </h2>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-green-500 dark:hover:text-green-400">Home</Link></li>
            <li><Link to="/about" className="hover:text-green-500 dark:hover:text-green-400">About Us</Link></li>
            <li><Link to="/services" className="hover:text-green-500 dark:hover:text-green-400">Services</Link></li>
            <li><Link to="/contact" className="hover:text-green-500 dark:hover:text-green-400">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-green-500 dark:hover:text-green-400">FAQ</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Our Services
          </h2>
          <ul className="space-y-2">
            <li><Link to="/appointments" className="hover:text-green-500 dark:hover:text-green-400">Book Appointment</Link></li>
            <li><Link to="/doctors" className="hover:text-green-500 dark:hover:text-green-400">Find Doctors</Link></li>
            <li><Link to="/reports" className="hover:text-green-500 dark:hover:text-green-400">Medical Reports</Link></li>
            <li><Link to="/emergency" className="hover:text-green-500 dark:hover:text-green-400">Emergency Care</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="dark:text-gray-300">Email: support@medicare.com</p>
          <p className="dark:text-gray-300">Phone: +91 98765 43210</p>
          <p className="dark:text-gray-300">Address: 123 Health Street, Pune, India</p>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com/medicare" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400"><Facebook size={20} /></a>
            <a href="https://twitter.com/medicare" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400"><Twitter size={20} /></a>
            <a href="https://instagram.com/medicare" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400"><Instagram size={20} /></a>
            <a href="https://linkedin.com/company/medicare" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400"><Linkedin size={20} /></a>
            <a href="https://youtube.com/@medicare" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400"><Youtube size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-10 py-4 px-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>&copy; {new Date().getFullYear()} MediCare. All Rights Reserved.</span>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 transition-colors"
        >
          {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </footer>
  );
}
