import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  onClick,
  className = "",
  type = "button",
  ...props
}) => {
  const baseClasses =
    "btn-primary inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl";

  const variants = {
    primary: "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-500/50",
    secondary:
      "bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600 focus:ring-gray-500/50",
    outline:
      "border border-sky-500 text-gray-100 hover:bg-sky-500 hover:text-white focus:ring-sky-500/50",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50",
    success:
      "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    xl: "px-8 py-4 text-lg gap-3",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className="animate-spin h-4 w-4" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
};

export default Button;
