// Loader.jsx - Updated with green theme

import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";

const sizes = {
  xs: "w-4 h-4",
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const colors = {
  green: "text-green-600 dark:text-green-400",
  blue: "text-blue-600 dark:text-blue-400",
  white: "text-white",
  gray: "text-gray-600 dark:text-gray-400",
};

export default function Loader({
  size = "md",
  color = "green",
  fullScreen = false,
  text = "",
}) {
  const loaderComponent = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} ${colors[color]} animate-spin`} />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {loaderComponent}
      </div>
    );
  }

  return loaderComponent;
}

Loader.propTypes = {
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  color: PropTypes.oneOf(["green", "blue", "white", "gray"]),
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
};

Loader.defaultProps = {
  size: "md",
  color: "green",
  fullScreen: false,
  text: "",
};