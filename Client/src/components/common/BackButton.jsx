import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx"; 
import PropTypes from "prop-types";

export default function BackButton({ position = "top-7 left-7", className = "" }) {

  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={clsx(
        "w-fit h-fit absolute bg-gray-500/10 dark:bg-gray-500/20 hover:bg-gray-500/20 dark:hover:bg-gray-500/30 p-2 rounded-md text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white",
        position,
        className
      )}
    >
      <ArrowLeft size={22} />
    </button>
  );
}

// ✅ Prop validation
BackButton.propTypes = {
  position: PropTypes.string,   // Tailwind position classes, e.g. "top-7 left-7"
  className: PropTypes.string,  // Additional custom classes
};
