import LoginCover from "../../../components/login/LoginCover";
import PatientSignupForm from "../../../components/signup/patient/PatientSignupForm";

export default function PatientSignup() {
    return (
        <div className="w-full h-screen overflow-hidden md:flex">
            <LoginCover />
            <PatientSignupForm />
        </div>
    );
}
