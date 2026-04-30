import LoginCover from "../../../components/login/LoginCover";
import DoctorSignupForm from "../../../components/signup/doctor/DoctorSignupForm";

export default function DoctorSignup() {
  return (
    <div className="w-full h-screen overflow-hidden md:flex">
      <LoginCover />
      <DoctorSignupForm />
    </div>
  );
}