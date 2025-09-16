import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = "",
  icon,
  ...props
}) => {
  const inputClasses = `
    block w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 
    placeholder-gray-400 rounded-xl shadow-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500
    ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}
    ${props.disabled ? "bg-gray-600 cursor-not-allowed opacity-60" : ""}
    ${icon ? "pl-10" : ""}
    ${className}
  `.trim();

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-100 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input className={inputClasses} {...props} />
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;