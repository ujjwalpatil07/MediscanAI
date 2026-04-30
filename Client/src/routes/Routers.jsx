import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "../components/notFound/NotFound";
import PatientLayout from "../layouts/PatientLayout";
import RoleSelector from "../pages/login/RoleSelector"
import Login from "../pages/login/Login";
import PatientSignup from "../pages/signup/patient/PatientSignup";
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import DoctorsListingPage from "../pages/DoctorsListingPage";
import DoctorProfilePage from "../pages/DoctorProfilePage";
import BookAppointmentPage from "../pages/BookAppointmentPage";

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<PatientLayout><LandingPage /></PatientLayout>} />
      <Route path="/home" element={<PatientLayout><HomePage /></PatientLayout>} />

      <Route path="/login" element={<RoleSelector />} />
      <Route path="/:role/login" element={<Login />} />
      <Route path="/patient/signup" element={<PatientSignup />} />

      <Route path="/doctors" element={<PatientLayout><DoctorsListingPage/></PatientLayout>} />
      <Route path="/doctor/:id" element={<PatientLayout><DoctorProfilePage /></PatientLayout>} />
      <Route path="/appointment" element={<PatientLayout><BookAppointmentPage/></PatientLayout>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
