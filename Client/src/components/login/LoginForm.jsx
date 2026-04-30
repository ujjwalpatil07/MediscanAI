import { useState, useMemo } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import BackButton from "../common/BackButton";

export default function LoginForm() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validRoles = ["doctor", "patient", "admin"];

  const formattedRole = useMemo(() => {
    if (!role) return null;
    return role?.charAt(0)?.toUpperCase() + role?.slice(1)?.toLowerCase();
  }, [role]);


  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Logged in as ${formattedRole}`);
    }, 1500);
  };
  

  if (!role || !validRoles?.includes(role?.toLowerCase())) {
    return (
      <div className="flex items-center justify-center w-1/2 min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-3">Invalid Role</h2>
          <p className="text-gray-500 mb-4">
            The role <span className="font-semibold">{role ?? "Unknown"}</span> does not exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="relative w-full md:w-1/2 h-screen flex items-center justify-center bg-white dark:bg-neutral-900 transition-colors duration-300 p-4">
      <div className="h-fit border-white mx-auto w-full max-w-md bg-transparent sm:p-5 md:p-8 overflow-auto no-scrollbar">

        <BackButton position="top-5 left-5 lg:top-7 lg:left-7" className="hidden md:flex" />

        <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
          Login as{" "}
          <span className="text-primary">{formattedRole}</span>
        </h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="email or username"
            className="w-full px-4 py-2 rounded-lg bg-[#F7FAFC] dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border border-[#CBD5E0] focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="w-full px-4 py-2 rounded-lg bg-[#F7FAFC] dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border border-[#CBD5E0] focus:outline-none focus:ring-2 focus:ring-green-600"
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
          <label className="flex items-center text-sm text-green-500">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <Link to={`/${role.toLowerCase()}/forgot-password`} className="text-sm text-green-500">
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-primary hover:bg-[#13623d] text-white py-2 rounded-lg font-medium transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {(formattedRole !== "Admin") && <>

          <p className="text-center text-sm mt-4 text-[#718096]">
            Don't have an account?{" "}
            <Link to={`/${role.toLowerCase()}/signup`} className="text-green-500">
              Create now
            </Link>
          </p>


          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-600" />
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-600" />
          </div>

          <button className="w-full flex items-center justify-center border border-gray-400 rounded-lg px-2 py-2 mb-3 text-[#67728A] transition hover:bg-gray-100 dark:hover:bg-neutral-800">
            <FaGoogle className="mr-2 text-red-500" /> <span>Continue with Google</span>
          </button>

          <button className="w-full flex items-center justify-center border border-gray-400 rounded-lg px-2 py-2 text-[#67728A] transition hover:bg-gray-100 dark:hover:bg-neutral-800">
            <FaFacebookF className="mr-2 text-blue-500" /> Continue with Facebook
          </button>
        </>}
      </div>
    </div>
  );
}
