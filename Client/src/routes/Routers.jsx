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

export default function Routers() {

  const {authLoading} = useContext(AuthContext);

  if(authLoading) {
      return <PageLoader text="Preparing your health dashboard..." />;
  }
  return (
    <Routes>
      <Route path="/" element={<PatientLayout><LandingPage /></PatientLayout>} />

      <Route path="/login" element={<RoleSelector />} />
      <Route path="/:role/login" element={<Login />} />
      <Route path="/patient/signup" element={<PatientSignup />} />
      <Route path="/doctor/signup" element={<DoctorSignup />} />


      <Route path="*" element={<PatientLayout><NotFound /></PatientLayout>} />
    </Routes>
  );
}
