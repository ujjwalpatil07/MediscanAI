import { useState, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import BackButton from "../../common/BackButton";
import ButtonLoader from "../../common/ButtonLoader";
import { doctorSignup } from "../../../services/auth.service";
import AuthContext from "../../../context/AuthContext";

const inputClass =
  "w-full px-4 py-2 rounded-lg bg-[#F7FAFC] dark:bg-neutral-800 " +
  "text-gray-900 dark:text-gray-100 border border-[#CBD5E0] " +
  "focus:outline-none focus:ring-2 focus:ring-green-600";

const errorInputClass =
  "w-full px-4 py-2 rounded-lg bg-[#F7FAFC] dark:bg-neutral-800 " +
  "text-gray-900 dark:text-gray-100 border border-red-500 " +
  "focus:outline-none focus:ring-2 focus:ring-red-500";

const checkboxClass =
  "w-4 h-4 text-green-600 rounded focus:ring-green-500 " +
  "border-gray-300 dark:border-neutral-600";

const buttonPrimaryClass =
  "bg-[#1A8151] hover:bg-[#13623d] text-white py-2.5 rounded-lg " +
  "font-medium transition disabled:opacity-60 flex items-center justify-center gap-2";

const buttonSecondaryClass =
  "bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 " +
  "dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 " +
  "py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2";

const TOTAL_STEPS = 3;

const STEP_TITLES = [
  "Account Setup",
  "Personal Information",
  "Professional Details",
];

const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 6,
    message: "Password must be at least 6 characters",
  },
  confirmPassword: {
    required: true,
    matchField: "password",
    message: "Passwords do not match",
  },
  firstName: {
    required: true,
    minLength: 2,
    message: "First name must be at least 2 characters",
  },
  lastName: {
    required: true,
    minLength: 2,
    message: "Last name must be at least 2 characters",
  },
  phone: {
    pattern: /^\+?[\d\s-]{10,15}$/,
    message: "Please enter a valid phone number",
  },
  specialty: {
    required: true,
    message: "Please select your specialty",
  },
  licenseNumber: {
    required: true,
    minLength: 5,
    message: "Please enter a valid license number",
  },
  yearsOfExperience: {
    required: true,
    min: 0,
    max: 50,
    message: "Please enter valid years of experience (0-50)",
  },
  medicalDegree: {
    required: true,
    message: "Please select your medical degree",
  },
  consultationFee: {
    required: true,
    min: 0,
    message: "Please enter a valid consultation fee",
  },
};

const INITIAL_FORM_DATA = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  phone: "",
  gender: "",
  dob: "",
  specialty: "",
  licenseNumber: "",
  yearsOfExperience: "",
  medicalDegree: "",
  consultationFee: "",
};

export default function DoctorSignupForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setLoginUser } = useContext(AuthContext);

  const [step, setStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem("doctorSignupStep");
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem("doctorSignupData");
      return saved ? JSON.parse(saved) : INITIAL_FORM_DATA;
    } catch {
      return INITIAL_FORM_DATA;
    }
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const saveToSession = useCallback((data, currentStep) => {
    try {
      sessionStorage.setItem("doctorSignupData", JSON.stringify(data));
      sessionStorage.setItem("doctorSignupStep", currentStep.toString());
    } catch {
      // Session storage might be full
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      saveToSession(updated, step);
      return updated;
    });
    setError("");
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateField = (name, value) => {
    const rules = VALIDATION_RULES[name];
    if (!rules) return "";

    if (rules.required && (!value || (typeof value === "string" && !value.trim()))) {
      return rules.message || `${name} is required`;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.message;
    }

    if (rules.minLength && value && value.trim().length < rules.minLength) {
      return rules.message;
    }

    if (rules.matchField && value !== formData[rules.matchField]) {
      return rules.message;
    }

    if (rules.min !== undefined && value && Number(value) < rules.min) {
      return rules.message;
    }

    if (rules.max !== undefined && value && Number(value) > rules.max) {
      return rules.message;
    }

    return "";
  };

  const validateStep = (stepNumber) => {
    const errors = {};
    let isValid = true;

    const stepFields = {
      1: ["email", "password", "confirmPassword"],
      2: ["firstName", "lastName", "phone"],
      3: ["specialty", "licenseNumber", "yearsOfExperience", "medicalDegree", "consultationFee"],
    };

    const fieldsToValidate = stepFields[stepNumber] || [];

    fieldsToValidate.forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        errors[field] = errorMsg;
        isValid = false;
      }
    });

    if (stepNumber === 1 && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!agreeChecked) {
      setError("Please agree to terms and conditions to continue");
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    setError("");
    if (validateStep(step)) {
      const nextStep = step + 1;
      setStep(nextStep);
      setAgreeChecked(false);
      saveToSession(formData, nextStep);
    }
  };

  const handleBack = () => {
    setError("");
    setFormErrors({});
    const prevStep = step - 1;
    setStep(prevStep);
    saveToSession(formData, prevStep);
  };

  const formatSignupData = () => {
    return {
      email: formData.email.trim(),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim() || undefined,
      gender: formData.gender || undefined,
      dob: formData.dob || undefined,
      specialty: formData.specialty,
      licenseNumber: formData.licenseNumber.trim(),
      yearsOfExperience: Number(formData.yearsOfExperience),
      medicalDegree: formData.medicalDegree,
      consultationFee: Number(formData.consultationFee),
    };
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setLoading(true);
    setError("");

    try {
      const signupData = formatSignupData();
      const response = await doctorSignup(signupData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setLoginUser(user);

      sessionStorage.removeItem("doctorSignupData");
      sessionStorage.removeItem("doctorSignupStep");

      enqueueSnackbar(
        "Registration successful! Welcome to MediscanAI. Please complete your profile.",
        { variant: "success" }
      );

      navigate("/d/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center gap-2 mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${s <= step
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-gray-400"
              }`}
          >
            {s < step ? "✓" : s}
          </div>
          {s < TOTAL_STEPS && (
            <div
              className={`w-12 h-0.5 mx-1 transition-all duration-300 ${s < step ? "bg-green-600" : "bg-gray-200 dark:bg-neutral-700"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full md:w-1/2 h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-900 transition-colors duration-300 p-4">
      <div className="h-full w-full max-w-xl bg-transparent sm:py-4 lg:p-8 overflow-auto no-scrollbar flex flex-col justify-center">
        <BackButton position="top-5 left-5" className="hidden sm:flex" />

        <h2 className="text-3xl font-bold text-center mb-1 dark:text-white">
          Doctor <span className="text-green-600">Sign Up</span>
        </h2>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          Step {step} of {TOTAL_STEPS}: {STEP_TITLES[step - 1]}
        </p>

        {renderStepIndicator()}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <InputField
                label="Email Address"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="dr.name@example.com"
                required
                error={formErrors.email}
              />

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={formErrors.password ? errorInputClass : inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={formErrors.confirmPassword ? errorInputClass : inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agree1"
                  checked={agreeChecked}
                  onChange={(e) => {
                    setAgreeChecked(e.target.checked);
                    setError("");
                  }}
                  className={checkboxClass}
                />
                <label
                  htmlFor="agree1"
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  I agree to the{" "}
                  <span className="text-green-600 hover:underline">Terms & Conditions</span>{" "}
                  and{" "}
                  <span className="text-green-600 hover:underline">Privacy Policy</span>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Stephen"
                required
                error={formErrors.firstName}
              />
              <InputField
                label="Last Name"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Conley"
                required
                error={formErrors.lastName}
              />

              <InputField
                label="Phone Number"
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                error={formErrors.phone}
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
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <InputField
                label="Date of Birth"
                id="dob"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />

              <div className="md:col-span-2 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="agree2"
                    checked={agreeChecked}
                    onChange={(e) => {
                      setAgreeChecked(e.target.checked);
                      setError("");
                    }}
                    className={checkboxClass}
                  />
                  <label
                    htmlFor="agree2"
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    I confirm that the above information is correct
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="specialty"
                  className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                >
                  Specialty <span className="text-red-500">*</span>
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className={formErrors.specialty ? errorInputClass : inputClass}
                  required
                >
                  <option value="">Select your specialty</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Radiology">Radiology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="ENT">ENT</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Dentistry">Dentistry</option>
                </select>
                {formErrors.specialty && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.specialty}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <InputField
                  label="License / Registration Number"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter your medical license number"
                  required
                  error={formErrors.licenseNumber}
                />
              </div>

              <InputField
                label="Years of Experience"
                id="yearsOfExperience"
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="e.g., 5"
                min="0"
                max="50"
                required
                error={formErrors.yearsOfExperience}
              />

              <div>
                <label
                  htmlFor="medicalDegree"
                  className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                >
                  Medical Degree <span className="text-red-500">*</span>
                </label>
                <select
                  id="medicalDegree"
                  name="medicalDegree"
                  value={formData.medicalDegree}
                  onChange={handleChange}
                  className={formErrors.medicalDegree ? errorInputClass : inputClass}
                  required
                >
                  <option value="">Select degree</option>
                  <option value="MBBS">MBBS</option>
                  <option value="MD">MD</option>
                  <option value="MS">MS</option>
                  <option value="BDS">BDS</option>
                  <option value="DNB">DNB</option>
                  <option value="DM">DM</option>
                  <option value="MCh">MCh</option>
                </select>
                {formErrors.medicalDegree && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.medicalDegree}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <InputField
                  label="Consultation Fee (₹)"
                  id="consultationFee"
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  min="0"
                  required
                  error={formErrors.consultationFee}
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="agree3"
                    checked={agreeChecked}
                    onChange={(e) => {
                      setAgreeChecked(e.target.checked);
                      setError("");
                    }}
                    className={checkboxClass}
                  />
                  <label
                    htmlFor="agree3"
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    I confirm that my professional details are accurate and I am licensed to practice
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className={`${buttonSecondaryClass} w-1/2`}
              >
                <FaArrowLeft size={14} />
                Back
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className={`${buttonPrimaryClass} ${step > 1 ? "w-1/2" : "w-full"}`}
              >
                Continue
                <FaArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`${buttonPrimaryClass} w-1/2`}
              >
                {loading ? (
                  <ButtonLoader text="Creating Account..." />
                ) : (
                  "Complete Registration"
                )}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/doctor/login")}
            className="text-green-600 hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
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
  error,
  min,
  max,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? errorInputClass : inputClass}
        required={required}
        min={min}
        max={max}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
  error: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
};