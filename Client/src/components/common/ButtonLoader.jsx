import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";

export default function ButtonLoader({ text = "Loading...", color = "white" }) {
  const colorClasses = {
    white: "text-white",
    green: "text-green-600",
    gray: "text-gray-600",
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className={`w-5 h-5 animate-spin ${colorClasses[color]}`} />
      <span>{text}</span>
    </div>
  );
}

ButtonLoader.propTypes = {
  text: PropTypes.string,
  color: PropTypes.oneOf(["white", "green", "gray"]),
};

ButtonLoader.defaultProps = {
  text: "Loading...",
  color: "white",
};