import { useState } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import BackButton from "../../common/BackButton";
import { patientSignup } from "../../../services/auth.service";
import { useContext } from "react";
import AuthContext from "../../../context/AuthContext";

const inputClass =
    "w-full px-4 py-2 rounded-lg bg-[#F7FAFC] dark:bg-neutral-800 " +
    "text-gray-900 dark:text-gray-100 border border-[#CBD5E0] " +
    "focus:outline-none focus:ring-2 focus:ring-green-600";

export default function PatientSignupForm() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { setLoginUser } = useContext(AuthContext)
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        mobile: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
        bloodGroup: "",
        height: "",
        weight: "",
        allergies: "",
        currentMedications: "",
        medicalHistoryCondition: "",
        emergencyContactName: "",
        emergencyContactRelation: "",
        emergencyContactPhone: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const validateStep1 = () => {
        if (!formData.firstName.trim()) {
            setError("First name is required");
            return false;
        }
        if (!formData.lastName.trim()) {
            setError("Last name is required");
            return false;
        }
        if (!formData.email.trim()) {
            setError("Email is required");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email");
            return false;
        }
        if (!formData.password) {
            setError("Password is required");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
        setError("");
    };

    const formatSignupData = () => {
        const allergiesArray = formData.allergies
            ? formData.allergies.split(",").map((item) => item.trim()).filter(Boolean)
            : [];

        const medicationsArray = formData.currentMedications
            ? formData.currentMedications.split(",").map((item) => {
                const parts = item.trim().split(" ");
                const dosage = parts.length > 1 ? parts.pop() : "";
                const name = parts.join(" ");
                return { name, dosage };
            }).filter((item) => item.name)
            : [];

        const medicalHistoryArray = formData.medicalHistoryCondition
            ? [
                {
                    condition: formData.medicalHistoryCondition,
                    diagnosedDate: null,
                    notes: "",
                },
            ]
            : [];

        const emergencyContact = formData.emergencyContactName
            ? {
                name: formData.emergencyContactName,
                relation: formData.emergencyContactRelation || "",
                phone: formData.emergencyContactPhone || "",
            }
            : undefined;

        return {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            mobile: formData.mobile || undefined,
            dob: formData.dob || undefined,
            gender: formData.gender || undefined,
            address: formData.address || undefined,
            bloodGroup: formData.bloodGroup || undefined,
            height: formData.height ? Number(formData.height) : undefined,
            weight: formData.weight ? Number(formData.weight) : undefined,
            allergies: allergiesArray,
            currentMedications: medicationsArray,
            medicalHistory: medicalHistoryArray,
            emergencyContact,
        };
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const signupData = formatSignupData();
            const response = await patientSignup(signupData);
            const { token, user } = response.data;

            localStorage.setItem("token", token);
            setLoginUser(user);

            enqueueSnackbar("Signup successful! Welcome to MediscanAI.", {
                variant: "success",
            });

            navigate("/");
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Signup failed. Please try again.";
            setError(errorMessage);
            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full md:w-1/2 h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-900 transition-colors duration-300 p-4">
            <div className="h-full border-white mx-auto w-full max-w-2xl bg-transparent sm:py-4 lg:p-8 overflow-auto no-scrollbar">
                <BackButton position="top-5 left-5" className="hidden sm:flex" />

                <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">
                    Patient <span className="text-green-600">Sign Up</span>
                </h2>

                <div className="flex justify-center items-center gap-2 mb-4">
                    <div
                        className={`h-2 w-20 rounded-full ${step === 1 ? "bg-green-600" : "bg-green-300"
                            }`}
                    />
                    <div
                        className={`h-2 w-20 rounded-full ${step === 2 ? "bg-green-600" : "bg-gray-300 dark:bg-neutral-600"
                            }`}
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 text-sm text-center">
                            {error}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSignup}>
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="First Name"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                required
                            />
                            <InputField
                                label="Last Name"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                required
                            />

                            <InputField
                                label="Phone"
                                id="mobile"
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                            />
                            <InputField
                                label="Email"
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />

                            <InputField
                                label="Date of Birth"
                                id="dob"
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                            />

                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                                >
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="address"
                                    className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                                >
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Health Street, Pune"
                                    rows={2}
                                    className={inputClass}
                                />
                            </div>

                            <PasswordField
                                label="Password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                            />
                            <PasswordField
                                label="Confirm Password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                            />

                            <div className="md:col-span-2 mt-4">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full bg-[#1A8151] hover:bg-[#13623d] text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                >
                                    Next
                                    <FaArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Blood Group"
                                id="bloodGroup"
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                placeholder="A+"
                            />

                            <InputField
                                label="Height (cm)"
                                id="height"
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="170"
                            />

                            <InputField
                                label="Weight (kg)"
                                id="weight"
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="65"
                            />

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="allergies"
                                    className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                                >
                                    Allergies
                                </label>
                                <input
                                    id="allergies"
                                    type="text"
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    placeholder="e.g., Peanuts, Penicillin (comma separated)"
                                    className={inputClass}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="currentMedications"
                                    className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                                >
                                    Current Medications
                                </label>
                                <input
                                    id="currentMedications"
                                    type="text"
                                    name="currentMedications"
                                    value={formData.currentMedications}
                                    onChange={handleChange}
                                    placeholder="e.g., Metformin 500mg, Paracetamol 650mg"
                                    className={inputClass}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="medicalHistoryCondition"
                                    className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                                >
                                    Medical History
                                </label>
                                <textarea
                                    id="medicalHistoryCondition"
                                    name="medicalHistoryCondition"
                                    value={formData.medicalHistoryCondition}
                                    onChange={handleChange}
                                    placeholder="e.g., Diabetes diagnosed 2019, Hypertension"
                                    rows={2}
                                    className={inputClass}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Emergency Contact
                                </h3>
                            </div>

                            <InputField
                                label="Contact Name"
                                id="emergencyContactName"
                                name="emergencyContactName"
                                value={formData.emergencyContactName}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                            />

                            <InputField
                                label="Relation"
                                id="emergencyContactRelation"
                                name="emergencyContactRelation"
                                value={formData.emergencyContactRelation}
                                onChange={handleChange}
                                placeholder="Spouse"
                            />

                            <InputField
                                label="Emergency Phone"
                                id="emergencyContactPhone"
                                type="tel"
                                name="emergencyContactPhone"
                                value={formData.emergencyContactPhone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                            />

                            <div className="md:col-span-2 mt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-1/2 bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                >
                                    <FaArrowLeft size={14} />
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-1/2 bg-[#1A8151] hover:bg-[#13623d] text-white py-2 rounded-lg font-medium transition disabled:opacity-60"
                                >
                                    {loading ? "Signing up..." : "Sign Up"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

function InputField({
    label,
    id,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required = false,
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClass}
                required={required}
            />
        </div>
    );
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
};

function PasswordField({ label, id, name, value, onChange, placeholder }) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={inputClass}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                >
                    {show ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );
}

PasswordField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};