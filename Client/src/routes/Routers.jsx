import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "../components/notFound/NotFound";
import PatientLayout from "../layouts/PatientLayout";
import RoleSelector from "../pages/login/RoleSelector"
import Login from "../pages/login/Login";
import PatientSignup from "../pages/signup/patient/PatientSignup";
import LandingPage from "../pages/LandingPage";
import DoctorSignup from "../pages/signup/doctor/DoctorSignup";
import AuthContext from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";
import HomePage from "../pages/HomePage";
import DoctorsListingPage from "../pages/patient/DoctorsListingPage";
import DoctorProfilePage from "../pages/patient/DoctorProfilePage";
import BookAppointmentPage from "../pages/patient/BookAppointmentPage";
import PatientAppointments from "../pages/patient/PatientAppoinments";

export default function Routers() {

  const { authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <PageLoader text="Preparing your health dashboard..." />;
  }
  return (
    <Routes>
      <Route path="/" element={<PatientLayout><LandingPage /></PatientLayout>} />
      <Route path="/home" element={<PatientLayout><HomePage /></PatientLayout>} />


      <Route path="/login" element={<RoleSelector />} />
      <Route path="/:role/login" element={<Login />} />
      <Route path="/patient/signup" element={<PatientSignup />} />
      <Route path="/doctor/signup" element={<DoctorSignup />} />


      <Route path="/doctors" element={<PatientLayout><DoctorsListingPage /></PatientLayout>} />
      <Route path="/doctor/:id" element={<PatientLayout><DoctorProfilePage /></PatientLayout>} />
      <Route path="/appointment" element={<PatientLayout><BookAppointmentPage /></PatientLayout>} />
      <Route path="/p/appointments" element={<PatientLayout><PatientAppointments /></PatientLayout>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
