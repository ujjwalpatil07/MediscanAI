import React, { useContext } from "react";
<<<<<<< HEAD
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "../components/notFound/NotFound";
=======
import { Route, Routes } from "react-router-dom";

>>>>>>> 092e5f4a7f752d970bace39a42518c0f0f8c3aa4
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

import DoctorDashboard from "../pages/doctor/Dashboard";
import DoctorAppointments from "../pages/doctor/Appointments";
import DoctorPatients from "../pages/doctor/Patients";
import DoctorPayments from "../pages/doctor/Payments";
import DoctorMessages from "../pages/doctor/Messages";
import DoctorProfile from "../pages/doctor/Profile";
// import DoctorSchedule from "../pages/doctor/Schedule";
import DoctorSettings from "../pages/doctor/Settings";
import DoctorLayout from "../layouts/DoctorLayout";
// import DoctorConsultation from "../pages/doctor/Consultation";
// import DoctorChat from "../pages/doctor/Chat";

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

      <Route element={<DoctorLayout />}>
        {/* Doctor Dashboard */}
        <Route path="/d/dashboard" element={<DoctorDashboard />} />
        <Route path="/d" element={<Navigate to="/d/dashboard" replace />} />

        {/* Doctor Appointments */}
        <Route path="/d/appointments" element={<DoctorAppointments />} />
        <Route path="/d/appointments/today" element={<DoctorAppointments />} />
        <Route path="/d/appointments/upcoming" element={<DoctorAppointments />} />
        <Route path="/d/appointments/completed" element={<DoctorAppointments />} />
        <Route path="/d/appointments/cancelled" element={<DoctorAppointments />} />
        <Route path="/d/appointments/:id" element={<DoctorAppointments />} />

        {/* Doctor Patients */}
        <Route path="/d/patients" element={<DoctorPatients />} />
        <Route path="/d/patients/:id" element={<DoctorPatients />} />
        <Route path="/d/patients/:id/medical-history" element={<DoctorPatients />} />

        {/* Doctor Consultations */}
        {/* <Route path="/d/consultations" element={<DoctorConsultation />} />
        <Route path="/d/consultations/new" element={<DoctorConsultation />} />
        <Route path="/d/consultations/:id" element={<DoctorConsultation />} /> */}

        {/* Doctor Schedule
        // <Route path="/d/schedule" element={<DoctorSchedule />} />
        // <Route path="/d/schedule/edit" element={<DoctorSchedule />} /> */}

        {/* Doctor Payments */}
        <Route path="/d/payments" element={<DoctorPayments />} />
        <Route path="/d/payments/history" element={<DoctorPayments />} />
        <Route path="/d/payments/withdraw" element={<DoctorPayments />} />

        {/* Doctor Messages */}
        <Route path="/d/messages" element={<DoctorMessages />} />
        <Route path="/d/messages/:patientId" element={<DoctorMessages />} />

        {/* Doctor Chat */}
        {/* <Route path="/d/chat/:patientId" element={<DoctorChat />} /> */}

        {/* Doctor Blog */}
        <Route path="/d/blog" element={<DoctorMessages />} />
        <Route path="/d/blog/new" element={<DoctorMessages />} />

        {/* Doctor Profile */}
        <Route path="/d/profile" element={<DoctorProfile />} />
        <Route path="/d/profile/edit" element={<DoctorProfile />} />

        {/* Doctor Settings */}
        <Route path="/d/settings" element={<DoctorSettings />} />
        <Route path="/d/change-password" element={<DoctorSettings />} />

        {/* Doctor Prescriptions */}
        <Route path="/d/prescriptions" element={<DoctorMessages />} />
        <Route path="/d/prescriptions/new/:patientId" element={<DoctorMessages />} />
        <Route path="/d/prescriptions/:id" element={<DoctorMessages />} />
      </Route>
    </Routes>
  );
}




