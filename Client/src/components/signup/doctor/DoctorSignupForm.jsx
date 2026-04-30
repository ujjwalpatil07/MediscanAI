import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import BackButton from "../../common/BackButton";
import { doctorSignup } from "../../../services/auth.service";
import AuthContext from "../../../context/AuthContext";

const inputClass =
  "w-full px-4 py-2 rounded-lg bg-[#F7FAFC] dark:bg-neutral-800 " +
  "text-gray-900 dark:text-gray-100 border border-[#CBD5E0] " +
  "focus:outline-none focus:ring-2 focus:ring-green-600";

const checkboxClass =
  "w-4 h-4 text-green-600 rounded focus:ring-green-500 " +
  "border-gray-300 dark:border-neutral-600";

const buttonPrimaryClass =
  "bg-[#1A8151] hover:bg-[#13623d] text-white py-2 rounded-lg " +
  "font-medium transition disabled:opacity-60";

const buttonSecondaryClass =
  "bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 " +
  "dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 " +
  "py-2 rounded-lg font-medium transition";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function DoctorSignupForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setLoginUser } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeChecked, setAgreeChecked] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
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
    availableDays: [],
    startTime: "",
    endTime: "",
    consultationFee: "",
    clinicStreet: "",
    clinicCity: "",
    clinicState: "",
    clinicPincode: "",
    degreeCertificate: null,
    idProof: null,
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email";
        return "";
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.trim().length < 3)
          return "Username must be at least 3 characters";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      case "firstName":
        if (!value.trim()) return "First name is required";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        return "";
      case "phone":
        if (value && !/^\+?[\d\s-]{10,}$/.test(value))
          return "Please enter a valid phone number";
        return "";
      case "specialty":
        if (!value) return "Please select a specialty";
        return "";
      case "licenseNumber":
        if (!value.trim()) return "License number is required";
        return "";
      case "yearsOfExperience":
        if (!value) return "Years of experience is required";
        if (Number(value) < 0) return "Experience cannot be negative";
        return "";
      case "medicalDegree":
        if (!value) return "Please select a medical degree";
        return "";
      case "startTime":
        if (!value) return "Start time is required";
        return "";
      case "endTime":
        if (!value) return "End time is required";
        return "";
      case "consultationFee":
        if (!value) return "Consultation fee is required";
        if (Number(value) < 0) return "Fee cannot be negative";
        return "";
      default:
        return "";
    }
  };

  const validateStep = (stepNumber) => {
    const errors = {};
    let isValid = true;

    const step1Fields = [
      "email",
      "username",
      "password",
      "confirmPassword",
    ];
    const step2Fields = ["firstName", "lastName"];
    const step3Fields = [
      "specialty",
      "licenseNumber",
      "yearsOfExperience",
      "medicalDegree",
    ];
    const step4Fields = ["startTime", "endTime", "consultationFee"];

    let fieldsToValidate = [];
    switch (stepNumber) {
      case 1:
        fieldsToValidate = step1Fields;
        break;
      case 2:
        fieldsToValidate = step2Fields;
        break;
      case 3:
        fieldsToValidate = step3Fields;
        break;
      case 4:
        fieldsToValidate = step4Fields;
        break;
    }

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    if (stepNumber === 4 && formData.availableDays.length === 0) {
      errors.availableDays = "Please select at least one available day";
      isValid = false;
    }

    if (!agreeChecked) {
      setError("Please agree to continue");
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    setError("");
    if (validateStep(step)) {
      setAgreeChecked(false);
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError("");
    setFormErrors({});
    setStep((prev) => prev - 1);
  };

  const formatSignupData = () => {
    return {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
      dob: formData.dob || undefined,
      gender: formData.gender || undefined,
      specialty: formData.specialty,
      licenseNumber: formData.licenseNumber,
      yearsOfExperience: Number(formData.yearsOfExperience),
      medicalDegree: formData.medicalDegree,
      availableDays: formData.availableDays,
      availableTimeSlots: {
        start: formData.startTime,
        end: formData.endTime,
      },
      consultationFee: Number(formData.consultationFee),
      clinicAddress: {
        street: formData.clinicStreet || undefined,
        city: formData.clinicCity || undefined,
        state: formData.clinicState || undefined,
        pincode: formData.clinicPincode || undefined,
      },
    };
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateStep(4)) return;

    setLoading(true);
    setError("");

    try {
      const signupData = formatSignupData();
      const response = await doctorSignup(signupData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setLoginUser(user);

      enqueueSnackbar("Doctor registration successful! Welcome to MediscanAI.", {
        variant: "success",
      });

      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    "Create Account",
    "Personal Information",
    "Professional Details",
    "Availability & Uploads",
  ];

  return (
    <div className="relative w-full md:w-1/2 h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-900 transition-colors duration-300 p-4">
      <div className="h-full border-white mx-auto w-full max-w-2xl bg-transparent sm:py-4 lg:p-8 overflow-auto no-scrollbar">
        <BackButton position="top-5 left-5" className="hidden sm:flex" />

        <h2 className="text-3xl font-bold text-center mb-1 dark:text-white">
          Doctor <span className="text-green-600">Sign Up</span>
        </h2>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          Step {step} of 4: {stepTitles[step - 1]}
        </p>

        <div className="flex justify-center items-center gap-1 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 w-14 rounded-full ${s <= step
                  ? "bg-green-600"
                  : "bg-gray-300 dark:bg-neutral-600"
                }`}
            />
          ))}
        </div>

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
                label="Email"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
                error={formErrors.email}
              />

              <InputField
                label="Username"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="example784596"
                required
                error={formErrors.username}
              />

              <PasswordField
                label="Password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                error={formErrors.password}
              />

              <PasswordField
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                error={formErrors.confirmPassword}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agree1"
                  checked={agreeChecked}
                  onChange={(e) => setAgreeChecked(e.target.checked)}
                  className={checkboxClass}
                />
                <label
                  htmlFor="agree1"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Agree to terms and conditions
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
                placeholder="John"
                required
                error={formErrors.firstName}
              />
              <InputField
                label="Last Name"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
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

              <div className="md:col-span-2 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="agree2"
                    checked={agreeChecked}
                    onChange={(e) => setAgreeChecked(e.target.checked)}
                    className={checkboxClass}
                  />
                  <label
                    htmlFor="agree2"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Agree to continue
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
                  Specialty
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Specialty</option>
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
                </select>
                {formErrors.specialty && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.specialty}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <InputField
                  label="License/Registration Number"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="SSBB454D4HDER787"
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
                placeholder="4"
                required
                error={formErrors.yearsOfExperience}
              />

              <div>
                <label
                  htmlFor="medicalDegree"
                  className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
                >
                  Medical Degree
                </label>
                <select
                  id="medicalDegree"
                  name="medicalDegree"
                  value={formData.medicalDegree}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Degree</option>
                  <option value="MBBS">MBBS</option>
                  <option value="MD">MD</option>
                  <option value="BDS">BDS</option>
                  <option value="MS">MS</option>
                  <option value="DNB">DNB</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.medicalDegree && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.medicalDegree}</p>
                )}
              </div>

              <div className="md:col-span-2 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="agree3"
                    checked={agreeChecked}
                    onChange={(e) => setAgreeChecked(e.target.checked)}
                    className={checkboxClass}
                  />
                  <label
                    htmlFor="agree3"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Agree to continue
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Available Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${formData.availableDays.includes(day)
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600"
                        }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
                {formErrors.availableDays && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.availableDays}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Start Time"
                  id="startTime"
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  error={formErrors.startTime}
                />
                <InputField
                  label="End Time"
                  id="endTime"
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  error={formErrors.endTime}
                />
              </div>

              <InputField
                label="Consultation Fee (₹)"
                id="consultationFee"
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                placeholder="500"
                required
                error={formErrors.consultationFee}
              />

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                  Clinic Address
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputField
                    label="Street"
                    id="clinicStreet"
                    name="clinicStreet"
                    value={formData.clinicStreet}
                    onChange={handleChange}
                    placeholder="1st Floor, Lotus Medical Complex"
                  />
                  <InputField
                    label="City"
                    id="clinicCity"
                    name="clinicCity"
                    value={formData.clinicCity}
                    onChange={handleChange}
                    placeholder="Mumbai"
                  />
                  <InputField
                    label="State"
                    id="clinicState"
                    name="clinicState"
                    value={formData.clinicState}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                  />
                  <InputField
                    label="Pincode"
                    id="clinicPincode"
                    name="clinicPincode"
                    value={formData.clinicPincode}
                    onChange={handleChange}
                    placeholder="400053"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                  Upload Documents
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1 text-gray-500 dark:text-gray-400">
                      Degree Certificate (Optional)
                    </label>
                    <input
                      type="file"
                      name="degreeCertificate"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-neutral-700 dark:file:text-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-gray-500 dark:text-gray-400">
                      ID Proof (Optional)
                    </label>
                    <input
                      type="file"
                      name="idProof"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-neutral-700 dark:file:text-green-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agree4"
                  checked={agreeChecked}
                  onChange={(e) => setAgreeChecked(e.target.checked)}
                  className={checkboxClass}
                />
                <label
                  htmlFor="agree4"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Agree to terms and conditions
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className={`${buttonSecondaryClass} flex items-center justify-center gap-2 w-1/2`}
              >
                <FaArrowLeft size={14} />
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className={`${buttonPrimaryClass} flex items-center justify-center gap-2 ${step > 1 ? "w-1/2" : "w-full"
                  }`}
              >
                Next
                <FaArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`${buttonPrimaryClass} w-1/2`}
              >
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-green-600 hover:underline font-medium"
          >
            Login here
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
        className={`${inputClass} ${error ? "border-red-500 focus:ring-red-500" : ""}`}
        required={required}
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
};

function PasswordField({ label, id, name, value, onChange, placeholder, error }) {
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
          className={`${inputClass} pr-10 ${error ? "border-red-500 focus:ring-red-500" : ""}`}
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
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
  error: PropTypes.string,
};