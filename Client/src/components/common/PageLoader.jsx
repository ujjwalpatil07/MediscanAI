import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { HeartPulse, Stethoscope, BriefcaseMedical, Hospital } from "lucide-react";

export default function PageLoader({ text = "Loading..." }) {
  const [activeIcon, setActiveIcon] = useState(0);

  const icons = [
    { Icon: HeartPulse, color: "text-red-500" },
    { Icon: Stethoscope, color: "text-blue-500" },
    { Icon: BriefcaseMedical, color: "text-green-500" },
    { Icon: Hospital, color: "text-purple-500" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex flex-col items-center justify-center z-50">
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-green-200 dark:border-green-800 animate-ping opacity-20" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-green-300 dark:border-green-700 animate-pulse opacity-30" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-neutral-800 shadow-xl flex items-center justify-center transform transition-all duration-500 hover:scale-110">
            <div className="relative w-10 h-10">
              {icons.map(({ Icon, color }, index) => (
                <div
                  key={index * 0.5}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${index === activeIcon
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-50 rotate-180"
                    }`}
                >
                  <Icon className={`w-10 h-10 ${color} drop-shadow-lg`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-36 h-36 animate-spin"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-200 dark:text-green-900"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-green-600 dark:text-green-400"
              strokeDasharray="283"
              strokeDashoffset="75"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-4">
        <span className="text-3xl font-bold text-green-600 dark:text-green-400">
          Mediscan
        </span>
        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          AI
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" />
        <span
          className="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </div>

      <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm font-medium">
        {text}
      </p>
    </div>
  );
}

PageLoader.propTypes = {
  text: PropTypes.string,
};

PageLoader.defaultProps = {
  text: "Loading...",
};