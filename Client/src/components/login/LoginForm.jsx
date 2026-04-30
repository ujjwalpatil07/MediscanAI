import { useState, useMemo, useContext } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import BackButton from "../common/BackButton";
import ButtonLoader from "../common/ButtonLoader";
import { patientLogin, doctorLogin } from "../../services/auth.service";
import AuthContext from "../../context/AuthContext";

const inputClass =
  "w-full px-4 py-2 rounded-lg bg-[#F7FAFC] dark:bg-neutral-800 " +
  "text-gray-900 dark:text-gray-100 border border-[#CBD5E0] " +
  "focus:outline-none focus:ring-2 focus:ring-green-600";

export default function LoginForm() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setLoginUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validRoles = ["doctor", "patient", "admin"];

  const formattedRole = useMemo(() => {
    if (!role) return null;
    return role?.charAt(0)?.toUpperCase() + role?.slice(1)?.toLowerCase();
  }, [role]);

  const roleColors = {
    patient: {
      primary: "text-green-600",
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      ring: "focus:ring-green-600",
      link: "text-green-500",
    },
    doctor: {
      primary: "text-green-600",
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      ring: "focus:ring-green-600",
      link: "text-green-500",
    },
    admin: {
      primary: "text-purple-600",
      bg: "bg-purple-600",
      hover: "hover:bg-purple-700",
      ring: "focus:ring-purple-600",
      link: "text-purple-500",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
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
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      let response;

      if (role === "patient") {
        response = await patientLogin({
          email: formData.email,
          password: formData.password,
        });
      } else if (role === "doctor") {
        response = await doctorLogin({
          email: formData.email,
          password: formData.password,
        });
      }

      const { token, user } = response.data;
      console.log(user);

      localStorage.setItem("token", token);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setLoginUser(user);

      enqueueSnackbar(`Welcome back, ${user.firstName}!`, {
        variant: "success",
      });

      navigate(`/`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if (!role || !validRoles?.includes(role?.toLowerCase())) {
    return (
      <div className="flex items-center justify-center w-full md:w-1/2 min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
            Invalid Role
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The role <span className="font-semibold">{role ?? "Unknown"}</span>{" "}
            does not exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const colors = roleColors[role] || roleColors.patient;

  return (
    <div className="relative w-full md:w-1/2 h-screen flex items-center justify-center bg-white dark:bg-neutral-900 transition-colors duration-300 p-4">
      <div className="h-fit border-white mx-auto w-full max-w-md bg-transparent sm:p-5 md:p-8 overflow-auto no-scrollbar">
        <BackButton
          position="top-5 left-5 lg:top-7 lg:left-7"
          className="hidden md:flex"
        />

        <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">
          Login as{" "}
          <span className={colors.primary}>{formattedRole}</span>
        </h2>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          Welcome back! Please enter your credentials.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </p>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm mb-1 text-gray-700 dark:text-gray-300"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="email or username"
            className={inputClass}
          />
        </div>

        <div className="mb-4">
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
              onKeyPress={handleKeyPress}
              placeholder="password"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            Remember me
          </label>
          <Link
            to={`/${role.toLowerCase()}/forgot-password`}
            className={`text-sm ${colors.link} hover:underline`}
          >
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full ${colors.bg} ${colors.hover} text-white py-2 rounded-lg font-medium transition disabled:opacity-60`}
        >
          {loading ? <ButtonLoader text="Signing in..." /> : "Sign in"}
        </button>

        {formattedRole !== "Admin" && (
          <>
            <p className="text-center text-sm mt-4 text-[#718096] dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to={`/${role.toLowerCase()}/signup`}
                className={`${colors.link} hover:underline font-medium`}
              >
                Create now
              </Link>
            </p>

            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300 dark:border-gray-600" />
              <span className="px-2 text-gray-400 dark:text-gray-500 text-sm">
                OR
              </span>
              <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            </div>

            <button className="w-full flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 mb-3 text-gray-700 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-neutral-800">
              <FaGoogle className="mr-2 text-red-500" />{" "}
              <span>Continue with Google</span>
            </button>

            <button className="w-full flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-gray-700 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-neutral-800">
              <FaFacebookF className="mr-2 text-blue-500" />{" "}
              <span>Continue with Facebook</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

LoginForm.propTypes = {
  role: PropTypes.string,
};