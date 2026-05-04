import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import PatientLayout from "../layouts/PatientLayout";

import AuthContext from "../context/AuthContext";

import NotFound from "../components/notFound/NotFound";
import PageLoader from "../components/common/PageLoader";

import RoleSelector from "../pages/login/RoleSelector"
import Login from "../pages/login/Login";
import PatientSignup from "../pages/signup/patient/PatientSignup";
import DoctorSignup from "../pages/signup/doctor/DoctorSignup";

import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import DoctorsListingPage from "../pages/patient/DoctorsListingPage";
import DoctorProfilePage from "../pages/patient/DoctorProfilePage";
import BookAppointmentPage from "../pages/patient/BookAppointmentPage";
import MyAppointmentsPage from "../pages/patient/MyAppointments";
import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientProfile from "../pages/patient/ProfilePage";
import SymptomChecker from "../pages/patient/SymptomChecker";
import PrescriptionsPage from "../pages/patient/PrescriptionsPage";
import MedicalRecordsPage from "../pages/patient/MedicalRecordsPage";

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

      <Route path="/p/dashboard" element={<PatientLayout><PatientDashboard /></PatientLayout>} />
      <Route path="/p/book-appointment/:doctor_id" element={<PatientLayout><BookAppointmentPage /></PatientLayout>} />
      <Route path="/p/my-appointments" element={<PatientLayout><MyAppointmentsPage /></PatientLayout>} />
      <Route path="/p/symptom-checker" element={<PatientLayout><SymptomChecker/></PatientLayout>} />
      <Route path="/p/prescriptions" element={<PatientLayout><PrescriptionsPage/></PatientLayout>} />
      <Route path="/p/medical-records" element={<PatientLayout><MedicalRecordsPage/></PatientLayout>} />
 
      <Route path="/p/profile" element={<PatientLayout><PatientProfile/></PatientLayout>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
