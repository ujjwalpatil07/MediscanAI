import { useState } from "react";
import { Outlet } from "react-router-dom";
import DoctorSidebar from "../components/doctor/DoctorSidebar";
import DoctorNavbar from "../components/doctor/DoctorNavbar";
import DoctorFooter from "../components/doctor/DoctorFooter";

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
      <DoctorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <DoctorNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>

        <DoctorFooter />
      </div>
    </div>
  );
}